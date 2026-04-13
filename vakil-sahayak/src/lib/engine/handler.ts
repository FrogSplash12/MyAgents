import { findOrCreateUser, updateUser } from "../persistence/repositories/users";
import { getOrCreateSession, updateSession } from "../persistence/repositories/sessions";
import { storeMessage } from "../persistence/repositories/messages";
import { writeAuditLog } from "../persistence/repositories/audit";
import { checkIdempotency, setIdempotency } from "../persistence/repositories/idempotency";
import { sendWhatsAppMessage, TwilioInboundMessage } from "../providers/twilio";
import { getHandler } from "../workflows/registry";
import { GLOBAL_COMMANDS, WorkflowInput, ConversationState } from "../workflows/types";

/**
 * Main message handler.
 * This is the single entry point for all inbound messages.
 *
 * Flow:
 * 1. Idempotency check (skip duplicate webhooks)
 * 2. Find or create user
 * 3. Load or create session
 * 4. Store inbound message
 * 5. Check for global commands
 * 6. Route to the correct workflow handler
 * 7. Apply state transitions and user updates
 * 8. Store outbound message
 * 9. Send reply via Twilio
 * 10. Write audit log
 */
export async function handleInboundMessage(
  message: TwilioInboundMessage
): Promise<void> {
  const { messageSid, from, body, mediaUrl } = message;

  // 1. Idempotency — skip if we already processed this message
  const existing = await checkIdempotency(messageSid);
  if (existing) {
    console.log(`Skipping duplicate message: ${messageSid}`);
    return;
  }

  // 2. Find or create user
  const user = await findOrCreateUser(from);

  // 3. Load or create session
  const session = await getOrCreateSession(user.id);

  // 4. Store inbound message
  await storeMessage({
    user_id: user.id,
    session_id: session.id,
    direction: "inbound",
    channel: "whatsapp",
    channel_message_id: messageSid,
    body,
    media_url: mediaUrl,
  });

  // 5. Check for global commands
  let currentState = session.state;
  const normalizedBody = body.toLowerCase().trim();

  if (GLOBAL_COMMANDS[normalizedBody]) {
    const targetState = GLOBAL_COMMANDS[normalizedBody];
    // Save previous state for help to return to
    if (targetState === "HELP") {
      await updateSession(session.id, {
        state: targetState,
        context: { ...session.context, previousState: currentState },
      });
    } else {
      await updateSession(session.id, { state: targetState });
    }
    currentState = targetState;
    // Re-load session after update
    session.state = currentState;
  }

  // 6. Route to workflow handler
  const handler = getHandler(currentState);
  const input: WorkflowInput = {
    user,
    session,
    messageBody: body,
    mediaUrl,
    rawPhone: from,
  };

  const output = await handler(input);

  // 7. Apply state transitions
  const sessionUpdates: { state?: string; context?: Record<string, unknown> } = {};
  if (output.newState !== currentState) {
    sessionUpdates.state = output.newState;
  }
  if (output.contextUpdates) {
    sessionUpdates.context = { ...session.context, ...output.contextUpdates };
  }
  if (Object.keys(sessionUpdates).length > 0) {
    await updateSession(session.id, sessionUpdates);
  }

  // Apply user updates if any
  if (output.userUpdates) {
    await updateUser(user.id, output.userUpdates);
  }

  // 8. Send reply via Twilio
  const replySid = await sendWhatsAppMessage(from, output.reply);

  // 9. Store outbound message
  await storeMessage({
    user_id: user.id,
    session_id: session.id,
    direction: "outbound",
    channel: "whatsapp",
    channel_message_id: replySid,
    body: output.reply,
  });

  // 10. Record idempotency and audit
  await setIdempotency(messageSid, { replySid, state: output.newState });

  await writeAuditLog({
    user_id: user.id,
    action: "message_processed",
    detail: {
      inbound_sid: messageSid,
      outbound_sid: replySid,
      from_state: currentState,
      to_state: output.newState,
    },
  });
}

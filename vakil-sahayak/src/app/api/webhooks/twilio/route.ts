import { NextRequest, NextResponse } from "next/server";
import { parseTwilioWebhook, validateTwilioSignature } from "@/lib/providers/twilio";
import { handleInboundMessage } from "@/lib/engine/handler";

/**
 * POST /api/webhooks/twilio
 *
 * Twilio sends inbound WhatsApp messages here.
 * This route:
 * 1. Validates the Twilio signature (skipped in sandbox/dev)
 * 2. Parses the webhook payload
 * 3. Hands off to the message handler
 * 4. Returns 200 (empty TwiML) so Twilio knows we received it
 *
 * We return an empty TwiML response because we send replies
 * via the Twilio REST API, not inline TwiML.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the URL-encoded form body
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Validate Twilio signature in production
    if (process.env.NODE_ENV === "production") {
      const signature = request.headers.get("x-twilio-signature") || "";
      const url = `${process.env.APP_URL}/api/webhooks/twilio`;

      if (!validateTwilioSignature(url, params, signature)) {
        console.error("Invalid Twilio signature");
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    // Parse and handle the message
    const message = parseTwilioWebhook(params);

    if (!message.from || !message.messageSid) {
      console.error("Invalid webhook payload: missing From or MessageSid");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Process asynchronously but within the request lifecycle
    // (keeps it simple for now — move to queue later for heavy work)
    await handleInboundMessage(message);

    // Return empty TwiML (we send replies via REST API)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);

    // Always return 200 to Twilio to prevent retries on app errors.
    // The error is logged; we don't want Twilio hammering a broken handler.
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  }
}

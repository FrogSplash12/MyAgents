import twilio from "twilio";

let twilioClient: twilio.Twilio | null = null;

function getClient(): twilio.Twilio {
  if (!twilioClient) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
    }
    twilioClient = twilio(sid, token);
  }
  return twilioClient;
}

/**
 * Send a WhatsApp message via Twilio.
 * Returns the Twilio message SID for tracking.
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<string> {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) {
    throw new Error("TWILIO_WHATSAPP_FROM must be set");
  }

  // Ensure the 'to' is in whatsapp: format
  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  const message = await getClient().messages.create({
    from,
    to: toFormatted,
    body,
  });

  return message.sid;
}

/**
 * Validate that an incoming request is genuinely from Twilio.
 * Uses Twilio's request validation with the auth token.
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token) return false;
  return twilio.validateRequest(token, signature, url, params);
}

/**
 * Normalized inbound message from Twilio webhook.
 */
export interface TwilioInboundMessage {
  messageSid: string;
  from: string;       // raw phone, e.g. "+919876543210"
  to: string;
  body: string;
  numMedia: number;
  mediaUrl?: string;
  mediaType?: string;
}

/**
 * Parse a Twilio webhook body into a normalized message.
 */
export function parseTwilioWebhook(
  params: Record<string, string>
): TwilioInboundMessage {
  const from = (params.From || "").replace("whatsapp:", "");
  const to = (params.To || "").replace("whatsapp:", "");

  return {
    messageSid: params.MessageSid || "",
    from,
    to,
    body: (params.Body || "").trim(),
    numMedia: parseInt(params.NumMedia || "0", 10),
    mediaUrl: params.MediaUrl0 || undefined,
    mediaType: params.MediaContentType0 || undefined,
  };
}

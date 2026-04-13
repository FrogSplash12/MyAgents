/**
 * Centralized environment configuration.
 * Fails fast at startup if required vars are missing.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  // Supabase
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  // Twilio
  twilioAccountSid: required("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: required("TWILIO_AUTH_TOKEN"),
  twilioWhatsappFrom: required("TWILIO_WHATSAPP_FROM"), // e.g. "whatsapp:+14155238886"

  // OpenAI (optional for first milestone, required later)
  openaiApiKey: optional("OPENAI_API_KEY", ""),

  // App
  appUrl: optional("APP_URL", "http://localhost:3000"),
  nodeEnv: optional("NODE_ENV", "development"),
} as const;

export type Env = typeof env;

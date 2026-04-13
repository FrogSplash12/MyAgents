import { getSupabase } from "../supabase";

export interface Message {
  id: string;
  user_id: string;
  session_id: string | null;
  direction: "inbound" | "outbound";
  channel: string;
  channel_message_id: string | null;
  body: string | null;
  media_url: string | null;
  created_at: string;
}

const TABLE = "messages";

export async function storeMessage(msg: {
  user_id: string;
  session_id?: string;
  direction: "inbound" | "outbound";
  channel?: string;
  channel_message_id?: string;
  body?: string;
  media_url?: string;
}): Promise<Message> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({
      user_id: msg.user_id,
      session_id: msg.session_id || null,
      direction: msg.direction,
      channel: msg.channel || "whatsapp",
      channel_message_id: msg.channel_message_id || null,
      body: msg.body || null,
      media_url: msg.media_url || null,
    })
    .select()
    .single();

  if (error) throw new Error(`storeMessage failed: ${error.message}`);
  return data;
}

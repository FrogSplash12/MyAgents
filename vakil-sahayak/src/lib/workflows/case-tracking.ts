import { getSupabase } from "../persistence/supabase";
import { WorkflowHandler } from "./types";

/**
 * ADD_CASE_WAITING_FOR_CNR: User is expected to send a CNR number.
 */
export const handleAddCase: WorkflowHandler = async (input) => {
  const cnr = input.messageBody.trim().toUpperCase();

  // Basic CNR format validation (Indian courts use varied formats)
  if (cnr.length < 10) {
    return {
      reply:
        "That doesn't look like a valid CNR number.\n\n" +
        "Please send the full CNR number (usually 16 characters).\n" +
        "Format example: DLHC01-123456-2024\n\n" +
        "Type /menu to go back.",
      newState: "ADD_CASE_WAITING_FOR_CNR",
    };
  }

  // Check if this case is already tracked by this user
  const { data: existing } = await getSupabase()
    .from("cases")
    .select("id")
    .eq("user_id", input.user.id)
    .eq("cnr_number", cnr)
    .maybeSingle();

  if (existing) {
    return {
      reply:
        `You're already tracking case ${cnr}.\n\n` +
        "I'll keep sending you updates whenever there's activity.\n\n" +
        "Type /menu to go back.",
      newState: "MAIN_MENU",
    };
  }

  // Insert the new case
  const { error } = await getSupabase()
    .from("cases")
    .insert({
      user_id: input.user.id,
      cnr_number: cnr,
      status: "active",
    });

  if (error) {
    console.error("Failed to insert case:", error.message);
    return {
      reply:
        "Sorry, I had trouble saving that case. Please try again.\n\n" +
        "Type /menu to go back.",
      newState: "MAIN_MENU",
    };
  }

  return {
    reply:
      `✅ Case ${cnr} is now being tracked!\n\n` +
      "I'll check for updates and notify you when there's activity.\n\n" +
      "Want to track another case? Just send the CNR number.\n" +
      "Type /menu to go back to the main menu.",
    newState: "MAIN_MENU",
  };
};

import { WorkflowHandler } from "./types";

/**
 * MAIN_MENU: Post-payment hub. User picks an action.
 * This is the target state after payment is confirmed.
 */
export const handleMainMenu: WorkflowHandler = async (input) => {
  const name = input.user.name || "there";
  const body = input.messageBody.toLowerCase().trim();

  // Route known menu commands
  if (body === "1" || body.includes("track") || body.includes("case")) {
    return {
      reply:
        "Sure! Please send me the *CNR number* of the case you want to track.\n\n" +
        "Format: XXHCXX-XXXXXX-XXXX",
      newState: "ADD_CASE_WAITING_FOR_CNR",
    };
  }

  if (body === "2" || body.includes("upload") || body.includes("document")) {
    return {
      reply:
        "Please send the document you'd like me to process.\n\n" +
        "I accept PDFs and images (photos of FIRs, orders, etc.)",
      newState: "UPLOAD_DOCUMENT_WAITING",
    };
  }

  // Default: show menu
  return {
    reply:
      `Hi ${name}! What would you like to do?\n\n` +
      "1️⃣ *Track a case* — Add a case by CNR number\n" +
      "2️⃣ *Upload a document* — Get summary & translation\n" +
      "3️⃣ *My cases* — View your tracked cases\n" +
      "4️⃣ *Help* — Get support\n\n" +
      "Just reply with the number or type your request.",
    newState: "MAIN_MENU",
  };
};

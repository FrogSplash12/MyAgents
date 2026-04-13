import { WorkflowHandler } from "./types";

/**
 * HELP: Support / fallback state.
 * Provides guidance and routes back to the appropriate state.
 */
export const handleHelp: WorkflowHandler = async (input) => {
  const previousState = (input.session.context.previousState as string) || "MAIN_MENU";

  return {
    reply:
      "🆘 *VakilSahayak Help*\n\n" +
      "*Commands you can use anytime:*\n" +
      "• /menu — Go to main menu\n" +
      "• /help — Show this help message\n" +
      "• /start — Restart onboarding\n\n" +
      "*What VakilSahayak does:*\n" +
      "• Tracks your court cases by CNR number\n" +
      "• Sends daily hearing updates on WhatsApp\n" +
      "• Summarizes and translates legal documents\n" +
      "• Keeps your case files organized\n\n" +
      "*Need human support?*\n" +
      "Email: support@vakilsahayak.com\n\n" +
      "Type /menu to go back.",
    newState: previousState as "MAIN_MENU",
    contextUpdates: { previousState: undefined },
  };
};

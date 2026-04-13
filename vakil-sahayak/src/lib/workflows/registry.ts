import { ConversationState, WorkflowHandler } from "./types";
import {
  handleNewLead,
  handleAskName,
  handleAskReferral,
  handleWaitingForPayment,
} from "./onboarding";
import { handleMainMenu } from "./main-menu";
import { handleHelp } from "./help";
import { handleAddCase } from "./case-tracking";
import { handleDocumentUpload } from "./document-upload";

/**
 * Maps every conversation state to its handler.
 * Adding a new workflow = adding handler + registering it here.
 */
const handlers: Record<ConversationState, WorkflowHandler> = {
  // Onboarding
  NEW_LEAD: handleNewLead,
  ASK_NAME: handleAskName,
  ASK_REFERRAL: handleAskReferral,
  WAITING_FOR_PAYMENT: handleWaitingForPayment,

  // Post-payment setup (stubs — route to main menu for now)
  POST_PAYMENT_CITY: handleMainMenu,
  POST_PAYMENT_LANGUAGE: handleMainMenu,
  POST_PAYMENT_DIGEST: handleMainMenu,

  // Main product
  MAIN_MENU: handleMainMenu,
  ADD_CASE_WAITING_FOR_CNR: handleAddCase,
  UPLOAD_DOCUMENT_WAITING: handleDocumentUpload,

  // Support
  HELP: handleHelp,
};

/**
 * Get the workflow handler for a given state.
 * Falls back to MAIN_MENU if the state is unknown.
 */
export function getHandler(state: string): WorkflowHandler {
  const handler = handlers[state as ConversationState];
  if (!handler) {
    console.warn(`Unknown state "${state}", falling back to MAIN_MENU`);
    return handlers.MAIN_MENU;
  }
  return handler;
}

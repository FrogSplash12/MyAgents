import { User } from "../persistence/repositories/users";
import { ConversationSession } from "../persistence/repositories/sessions";

/**
 * All possible conversation states.
 * Adding a new state here is the first step to extending any workflow.
 */
export type ConversationState =
  // Onboarding
  | "NEW_LEAD"
  | "ASK_NAME"
  | "ASK_REFERRAL"
  | "WAITING_FOR_PAYMENT"
  // Post-payment setup
  | "POST_PAYMENT_CITY"
  | "POST_PAYMENT_LANGUAGE"
  | "POST_PAYMENT_DIGEST"
  // Main product
  | "MAIN_MENU"
  | "ADD_CASE_WAITING_FOR_CNR"
  | "UPLOAD_DOCUMENT_WAITING"
  // Support
  | "HELP";

/**
 * Normalized input to a workflow step.
 */
export interface WorkflowInput {
  user: User;
  session: ConversationSession;
  messageBody: string;
  mediaUrl?: string;
  rawPhone: string;
}

/**
 * Output from a workflow step.
 */
export interface WorkflowOutput {
  reply: string;
  newState: ConversationState;
  contextUpdates?: Record<string, unknown>;
  userUpdates?: Partial<Pick<User, "name" | "referral_source" | "city" | "language" | "status">>;
}

/**
 * A workflow handler processes one state transition.
 */
export type WorkflowHandler = (input: WorkflowInput) => Promise<WorkflowOutput>;

/**
 * Global commands that work from any state.
 */
export const GLOBAL_COMMANDS: Record<string, ConversationState> = {
  "/help": "HELP",
  "/start": "NEW_LEAD",
  "/menu": "MAIN_MENU",
};

import { WorkflowHandler, WorkflowOutput } from "./types";

/**
 * NEW_LEAD: First contact. User says anything (hi, hello, etc.)
 * → Greet and ask for name.
 */
export const handleNewLead: WorkflowHandler = async () => {
  return {
    reply:
      "🙏 Namaste! Welcome to VakilSahayak.\n\n" +
      "I help advocates manage cases, track court dates, and stay organized — right here on WhatsApp.\n\n" +
      "To get started, please tell me your *full name* (as you'd like to be addressed).",
    newState: "ASK_NAME",
  };
};

/**
 * ASK_NAME: We asked for their name. They reply with it.
 * → Store name, ask how they heard about us.
 */
export const handleAskName: WorkflowHandler = async (input) => {
  const name = input.messageBody.trim();

  if (name.length < 2) {
    return {
      reply: "That doesn't look like a name. Could you please share your full name?",
      newState: "ASK_NAME",
    };
  }

  return {
    reply:
      `Thank you, ${name}! Great to have you here.\n\n` +
      "One quick question — how did you hear about VakilSahayak?\n\n" +
      "1️⃣ A colleague referred me\n" +
      "2️⃣ Bar association\n" +
      "3️⃣ Social media\n" +
      "4️⃣ Google search\n" +
      "5️⃣ Other\n\n" +
      "Just reply with the number or type your answer.",
    newState: "ASK_REFERRAL",
    userUpdates: { name, status: "onboarding" },
  };
};

const REFERRAL_MAP: Record<string, string> = {
  "1": "colleague_referral",
  "2": "bar_association",
  "3": "social_media",
  "4": "google_search",
  "5": "other",
};

/**
 * ASK_REFERRAL: We asked how they heard about us.
 * → Store referral, move to payment gate.
 */
export const handleAskReferral: WorkflowHandler = async (input) => {
  const raw = input.messageBody.trim();
  const referral = REFERRAL_MAP[raw] || raw;

  return {
    reply:
      "Thanks for letting us know! 🙌\n\n" +
      "VakilSahayak is a paid tool built specifically for practicing advocates.\n\n" +
      "Here's what you get:\n" +
      "• Daily case hearing updates on WhatsApp\n" +
      "• Track unlimited cases by CNR number\n" +
      "• Document summarization & translation\n" +
      "• Organized case file management\n\n" +
      "💳 *To activate your account, please complete the payment using the link below:*\n\n" +
      "[Payment link will be shared here once Razorpay is integrated]\n\n" +
      "Once payment is confirmed, I'll set up your dashboard right away.\n\n" +
      "Type /help if you have any questions.",
    newState: "WAITING_FOR_PAYMENT",
    userUpdates: { referral_source: referral },
  };
};

/**
 * WAITING_FOR_PAYMENT: User has not yet paid.
 * → Politely remind them. In future, this will check Razorpay status.
 */
export const handleWaitingForPayment: WorkflowHandler = async (input) => {
  const name = input.user.name || "there";

  return {
    reply:
      `Hi ${name}, your account is almost ready!\n\n` +
      "I'm waiting for your payment confirmation to activate all features.\n\n" +
      "If you've already paid, please give me a moment — I'll check and update your account.\n\n" +
      "If you need the payment link again, just type *\"pay\"*.\n\n" +
      "For questions, type /help.",
    newState: "WAITING_FOR_PAYMENT",
  };
};

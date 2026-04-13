import { WorkflowHandler } from "./types";

/**
 * UPLOAD_DOCUMENT_WAITING: User is expected to send a document.
 * For now, acknowledges the intent. Full processing comes later.
 */
export const handleDocumentUpload: WorkflowHandler = async (input) => {
  if (!input.mediaUrl) {
    return {
      reply:
        "I don't see a document attached. Please send a PDF or image file.\n\n" +
        "You can take a photo of a document or share a PDF from your files.\n\n" +
        "Type /menu to go back.",
      newState: "UPLOAD_DOCUMENT_WAITING",
    };
  }

  // For now, acknowledge receipt. Full processing (OCR, summarize, store) comes later.
  return {
    reply:
      "📄 Document received! Thank you.\n\n" +
      "Document processing (summarization & translation) is coming soon. " +
      "I've noted your upload and will process it once this feature is live.\n\n" +
      "Type /menu to go back.",
    newState: "MAIN_MENU",
    contextUpdates: { lastDocumentUrl: input.mediaUrl },
  };
};

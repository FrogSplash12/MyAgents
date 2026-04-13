/**
 * AI Provider — wraps OpenAI behind a clean interface.
 * Not needed for the first milestone (onboarding is rule-based),
 * but the abstraction is here so business logic never imports OpenAI directly.
 */

export interface SummarizeResult {
  summary: string;
  tokensUsed: number;
}

export interface TranslateResult {
  translated: string;
  sourceLanguage: string;
  tokensUsed: number;
}

/**
 * Summarize a legal document or text block.
 * Placeholder — will be implemented when document workflows are built.
 */
export async function summarizeText(_text: string): Promise<SummarizeResult> {
  // TODO: Implement with OpenAI when document workflows are added
  return {
    summary: "[Summarization not yet implemented]",
    tokensUsed: 0,
  };
}

/**
 * Translate text to a target language.
 * Placeholder — will be implemented when translation workflows are built.
 */
export async function translateText(
  _text: string,
  _targetLanguage: string
): Promise<TranslateResult> {
  // TODO: Implement with OpenAI when translation workflows are added
  return {
    translated: "[Translation not yet implemented]",
    sourceLanguage: "unknown",
    tokensUsed: 0,
  };
}

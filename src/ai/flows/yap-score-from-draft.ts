'use server';

/**
 * @fileOverview Calculates a Yap score for a given X post draft based on sentiment and keywords.
 *
 * - yapScoreFromDraft - A function that accepts an X post draft and returns a Yap score.
 * - YapScoreFromDraftInput - The input type for the yapScoreFromDraft function.
 * - YapScoreFromDraftOutput - The return type for the yapScoreFromDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YapScoreFromDraftInputSchema = z.object({
  draft: z.string().describe('The X post draft to analyze.'),
});
export type YapScoreFromDraftInput = z.infer<typeof YapScoreFromDraftInputSchema>;

const YapScoreFromDraftOutputSchema = z.object({
  yapScore: z.number().describe('The predicted Yap score (0-10 scale).'),
  sentiment: z.string().describe('The sentiment of the draft (positive, negative, neutral).'),
  keywords: z.array(z.string()).describe('Relevant keywords found in the draft.'),
  suggestions: z.array(z.string()).describe('Suggestions to improve the Yap score.'),
});
export type YapScoreFromDraftOutput = z.infer<typeof YapScoreFromDraftOutputSchema>;

export async function yapScoreFromDraft(input: YapScoreFromDraftInput): Promise<YapScoreFromDraftOutput> {
  return yapScoreFromDraftFlow(input);
}

const yapScorePrompt = ai.definePrompt({
  name: 'yapScorePrompt',
  input: {schema: YapScoreFromDraftInputSchema},
  output: {schema: YapScoreFromDraftOutputSchema},
  prompt: `You are an AI Yap score predictor for the Kaito community called YapVault.

  Analyze the following X post draft.

  Your scoring should be based on sentiment and keywords.
  - Sentiment: A positive sentiment should have a higher score (2x weight).
  - Keywords: Give a +15% boost for each of the following keywords found: 'GRID', 'ROMA', 'zkSync', 'Kaia', 'Sophon'.

  Based on this, predict a Yap score on a 0-10 scale.

  Draft: {{{draft}}}

  Also provide:
  - A sentiment analysis (positive, negative, neutral).
  - A list of the relevant keywords found.
  - A list of suggestions to improve the score (e.g., "Add a question to encourage replies.").
`,
});

const yapScoreFromDraftFlow = ai.defineFlow(
  {
    name: 'yapScoreFromDraftFlow',
    inputSchema: YapScoreFromDraftInputSchema,
    outputSchema: YapScoreFromDraftOutputSchema,
  },
  async input => {
    const {output} = await yapScorePrompt(input);

    if (!output) {
      throw new Error('Failed to get a response from the AI.');
    }

    let score = output.yapScore;

    // Apply keyword boosts
    const boostKeywords = ['GRID', 'ROMA', 'zkSync', 'Kaia', 'Sophon'];
    let keywordBoost = 0;
    for (const kw of boostKeywords) {
      if (input.draft.toLowerCase().includes(kw.toLowerCase())) {
        keywordBoost += 0.15 * 10; // 15% of the max score
      }
    }
    score += keywordBoost;

    // Apply sentiment weight
    if (output.sentiment.toLowerCase() === 'positive') {
      score *= 1.2; // Giving a 20% boost for positive sentiment as 2x is too much
    } else if (output.sentiment.toLowerCase() === 'negative') {
      score *= 0.8;
    }

    // Clamp score between 0 and 10
    score = Math.max(0, Math.min(10, score));

    // Add a default suggestion if none are returned
    if (!output.suggestions || output.suggestions.length === 0) {
      output.suggestions = ["Add a question for 2-3x reply weights."];
    }
    
    return {
      ...output,
      yapScore: parseFloat(score.toFixed(1)),
    };
  }
);

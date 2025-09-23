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
});
export type YapScoreFromDraftOutput = z.infer<typeof YapScoreFromDraftOutputSchema>;

export async function yapScoreFromDraft(input: YapScoreFromDraftInput): Promise<YapScoreFromDraftOutput> {
  return yapScoreFromDraftFlow(input);
}

const yapScorePrompt = ai.definePrompt({
  name: 'yapScorePrompt',
  input: {schema: YapScoreFromDraftInputSchema},
  output: {schema: YapScoreFromDraftOutputSchema},
  prompt: `You are an AI Yap score predictor for the Kaito community.

  Analyze the following X post draft and predict a Yap score (0-10 scale) based on its sentiment and the presence of relevant keywords (GRID, zkSync, Sophon, Kaia, DeFi, AI, Web3).

  Draft: {{{draft}}}

  Provide a sentiment analysis (positive, negative, neutral) and extract the most relevant keywords.
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
    return output!;
  }
);

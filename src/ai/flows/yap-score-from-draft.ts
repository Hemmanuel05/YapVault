'use server';

/**
 * @fileOverview Calculates a Yap score and Tweepcred score for a given X post draft.
 *
 * - yapScoreFromDraft - A function that accepts an X post draft and returns a Yap score and Tweepcred analysis.
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
  suggestions: z.array(z.string()).describe('Suggestions to improve the Yap score based on the modern X algorithm.'),
  tweepcredScore: z.number().describe('The predicted Tweepcred score (0-10 scale).'),
  tweepcredSuggestions: z.array(z.string()).describe('Suggestions to improve the Tweepcred score.'),
});
export type YapScoreFromDraftOutput = z.infer<typeof YapScoreFromDraftOutputSchema>;

export async function yapScoreFromDraft(input: YapScoreFromDraftInput): Promise<YapScoreFromDraftOutput> {
  return yapScoreFromDraftFlow(input);
}

const yapScorePrompt = ai.definePrompt({
  name: 'yapScorePrompt',
  input: {schema: YapScoreFromDraftInputSchema},
  output: {schema: YapScoreFromDraftOutputSchema},
  prompt: `You are an AI Yap score and Tweepcred predictor for the Kaito community called YapVault. You are an expert on the modern X algorithm, which rewards high-quality content and replies, and does not prioritize hashtags.

  Analyze the following X post draft for two things: Yap Score and Tweepcred Score.

  1.  **Yap Score Analysis:**
      Your Yap scoring should be based on sentiment and keywords.
      - Sentiment: A positive sentiment should have a higher score (2x weight).
      - Keywords: Give a +15% boost for each of the following keywords found: 'GRID', 'ROMA', 'zkSync', 'Kaia', 'Sophon'.
      Based on this, predict a Yap score on a 0-10 scale.
      Also provide:
      - A sentiment analysis (positive, negative, neutral).
      - A list of the relevant keywords found.
      - A list of suggestions to improve the Yap score. Suggestions should focus on modern X engagement strategies like asking open-ended questions, improving clarity, or sparking respectful debate. Avoid suggesting hashtags.

  2.  **Tweepcred Score Analysis:**
      Tweepcred is X's internal reputation system. A high score increases reach, a low score reduces it. Analyze the draft for behaviors that would affect this score.
      - Penalize: Aggressive language, spammy content, rule-breaking behavior, and anything that could be seen as negative manipulation.
      - Reward: Positive community engagement, providing value, fostering healthy discussion.
      - Based on this, predict a Tweepcred score on a 0-10 scale.
      - Provide a list of suggestions for improving the post to protect or enhance the user's Tweepcred.

  Draft: {{{draft}}}
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
      output.suggestions = ["Try asking an open-ended question to encourage more detailed replies."];
    }
    if (!output.tweepcredSuggestions || output.tweepcredSuggestions.length === 0) {
        output.tweepcredSuggestions = ["This post looks good and follows community guidelines. Keep it up!"];
    }
    
    return {
      ...output,
      yapScore: parseFloat(score.toFixed(1)),
    };
  }
);

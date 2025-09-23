import {z} from 'genkit';

export const YapScoreFromDraftInputSchema = z.object({
  draft: z.string().describe('The X post draft to analyze.'),
  authorFollowerCount: z.number().optional().describe('The number of followers the author of the post has. This provides context on their authority and influence.'),
});
export type YapScoreFromDraftInput = z.infer<typeof YapScoreFromDraftInputSchema>;

export const YapScoreFromDraftOutputSchema = z.object({
  yapScore: z.number().describe('The predicted Yap score (0-10 scale).'),
  sentiment: z.string().describe('The sentiment of the draft (positive, negative, neutral).'),
  keywords: z.array(z.string()).describe('Relevant keywords found in the draft.'),
  suggestions: z.array(z.string()).describe('Suggestions to improve the Yap score based on the modern X algorithm.'),
  tweepcredScore: z.number().describe('The predicted Tweepcred score (0-10 scale).'),
  tweepcredSuggestions: z.array(z.string()).describe('Suggestions to improve the Tweepcred score.'),
});
export type YapScoreFromDraftOutput = z.infer<typeof YapScoreFromDraftOutputSchema>;

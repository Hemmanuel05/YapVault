import {z} from 'genkit';

export const AnalyzePublishedPostInputSchema = z.object({
  postText: z.string().describe('The text content of the published X post.'),
});
export type AnalyzePublishedPostInput = z.infer<
  typeof AnalyzePublishedPostInputSchema
>;

export const AnalyzePublishedPostOutputSchema = z.object({
  whatWorked: z.array(z.string()).describe('A list of strengths and what the post did well.'),
  couldBeImproved: z.array(z.string()).describe('A list of weaknesses and suggestions for improvement.'),
  missedOpportunityScore: z.number().min(0).max(10).describe('A score from 0-10 indicating the level of missed potential for engagement or impact. 10 is a huge missed opportunity.'),
});
export type AnalyzePublishedPostOutput = z.infer<
  typeof AnalyzePublishedPostOutputSchema
>;

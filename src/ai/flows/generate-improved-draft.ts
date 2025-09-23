'use server';

/**
 * @fileOverview A flow for improving an X/Twitter draft.
 *
 * - generateImprovedDraft - A function that improves a draft.
 * - GenerateImprovedDraftInput - The input type for the generateImprovedDraft function.
 * - GenerateImprovedDraftOutput - The return type for the generateImprovedDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovedDraftInputSchema = z.object({
  draft: z.string().describe('The X/Twitter draft to improve.'),
});
export type GenerateImprovedDraftInput = z.infer<typeof GenerateImprovedDraftInputSchema>;

const GenerateImprovedDraftOutputSchema = z.object({
  improvedDraft: z.string().describe('The improved X/Twitter draft.'),
});
export type GenerateImprovedDraftOutput = z.infer<typeof GenerateImprovedDraftOutputSchema>;

export async function generateImprovedDraft(
  input: GenerateImprovedDraftInput
): Promise<GenerateImprovedDraftOutput> {
  return generateImprovedDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovedDraftPrompt',
  input: {schema: GenerateImprovedDraftInputSchema},
  output: {schema: GenerateImprovedDraftOutputSchema},
  prompt: `You are an expert social media manager specializing in creating engaging content for X. You understand the modern X algorithm, which prioritizes replies and quality content over hashtags.

You will rewrite the following draft to make it more engaging, clear, and likely to spark conversation.

- Make the hook stronger.
- Clarify the main point.
- If appropriate, add an open-ended question to encourage replies.
- Maintain the original voice and tone if possible, but make it more impactful.
- Do not use hashtags unless they are a core part of the topic.

Original Draft:
{{{draft}}}
`,
});

const generateImprovedDraftFlow = ai.defineFlow(
  {
    name: 'generateImprovedDraftFlow',
    inputSchema: GenerateImprovedDraftInputSchema,
    outputSchema: GenerateImprovedDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

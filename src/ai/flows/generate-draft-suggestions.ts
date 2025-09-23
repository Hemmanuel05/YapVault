'use server';

/**
 * @fileOverview A flow for generating X/Twitter draft suggestions based on trending topics and successful past posts.
 *
 * - generateDraftSuggestions - A function that generates draft suggestions.
 * - GenerateDraftSuggestionsInput - The input type for the generateDraftSuggestions function.
 * - GenerateDraftSuggestionsOutput - The return type for the generateDraftSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDraftSuggestionsInputSchema = z.object({
  trendingTopic: z.string().describe('The current trending topic on X/Twitter.'),
  successfulPastPosts: z
    .array(z.string())
    .describe(
      'An array of successful past X/Twitter posts.  Each element should be a string representing the text of the post.'
    ),
});
export type GenerateDraftSuggestionsInput = z.infer<typeof GenerateDraftSuggestionsInputSchema>;

const GenerateDraftSuggestionsOutputSchema = z.object({
  draftSuggestions: z
    .array(z.string())
    .describe(
      'An array of suggested X/Twitter drafts based on the trending topic and successful past posts.'
    ),
});
export type GenerateDraftSuggestionsOutput = z.infer<typeof GenerateDraftSuggestionsOutputSchema>;

export async function generateDraftSuggestions(
  input: GenerateDraftSuggestionsInput
): Promise<GenerateDraftSuggestionsOutput> {
  return generateDraftSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDraftSuggestionsPrompt',
  input: {schema: GenerateDraftSuggestionsInputSchema},
  output: {schema: GenerateDraftSuggestionsOutputSchema},
  prompt: `You are an expert social media manager specializing in creating engaging content for X/Twitter.

You will use the trending topic and successful past posts to generate a list of X/Twitter draft suggestions.

Trending Topic: {{{trendingTopic}}}

Successful Past Posts:
{{#each successfulPastPosts}}
- {{{this}}}
{{/each}}

Generate a list of X/Twitter draft suggestions that are likely to be engaging to the Kaito AI community. Make sure to include relevant hashtags.
`,
});

const generateDraftSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateDraftSuggestionsFlow',
    inputSchema: GenerateDraftSuggestionsInputSchema,
    outputSchema: GenerateDraftSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

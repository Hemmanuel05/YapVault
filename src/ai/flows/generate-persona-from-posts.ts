'use server';

/**
 * @fileOverview A flow for generating a user persona from their past posts.
 *
 * - generatePersonaFromPosts - A function that analyzes posts and creates a persona description.
 */

import {ai} from '@/ai/genkit';
import {
    GeneratePersonaFromPostsInputSchema,
    GeneratePersonaFromPostsOutputSchema,
    type GeneratePersonaFromPostsInput,
} from '@/ai/schemas/generate-persona-from-posts';
import { GeneratePersonaFromPostsOutput } from '@/ai/schemas/generate-persona-from-posts';
import { googleAI } from '@genkit-ai/googleai';


export async function generatePersonaFromPosts(
  input: GeneratePersonaFromPostsInput
): Promise<GeneratePersonaFromPostsOutput> {
  return generatePersonaFromPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonaFromPostsPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: GeneratePersonaFromPostsInputSchema},
  output: {schema: GeneratePersonaFromPostsOutputSchema},
  prompt: `You are an expert brand strategist and social media analyst. Your task is to analyze a collection of a user's past X/Twitter posts and synthesize a concise, insightful persona description.

This persona description should be written in the style of a bio and capture the user's essence.

**Analysis Dimensions:**
1.  **Core Topics:** What are the recurring themes, projects, or areas of expertise? (e.g., DeFi, L2 scaling, NFT infrastructure, AI agents).
2.  **Tone & Voice:** How do they communicate? (e.g., analytical, witty, educational, contrarian, formal, casual).
3.  **Audience:** Who are they implicitly talking to? (e.g., developers, analysts, new users, crypto OGs).
4.  **Content Style:** What format do their posts usually take? (e.g., data-driven insights, technical threads, quick takes, questions, comedy).

**Instructions:**
Analyze the following posts. Based on your analysis, generate a single, well-written paragraph that describes this user's persona. This description should be suitable for use as a custom instruction for another AI to "clone" their voice.

**User's Past Posts:**
{{#each posts}}
- {{{this}}}
{{/each}}

Generate the persona description now.
`,
});

const generatePersonaFromPostsFlow = ai.defineFlow(
  {
    name: 'generatePersonaFromPostsFlow',
    inputSchema: GeneratePersonaFromPostsInputSchema,
    outputSchema: GeneratePersonaFromPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

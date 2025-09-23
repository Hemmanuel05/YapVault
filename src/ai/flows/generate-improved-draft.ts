'use server';

/**
 * @fileOverview A flow for improving an X/Twitter draft, with optional persona-based styling.
 *
 * - generateImprovedDraft - A function that improves a draft based on a selected persona.
 * - GenerateImprovedDraftInput - The input type for the generateImprovedDraft function.
 * - GenerateImprovedDraftOutput - The return type for the generateImprovedDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovedDraftInputSchema = z.object({
  draft: z.string().describe('The X/Twitter draft to improve.'),
  persona: z.string().optional().describe('The persona to adopt for the rewrite (e.g., "The Wale", "The Bandit").'),
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

You will rewrite the user's draft to make it more engaging, clear, and likely to spark conversation.

**Persona Definitions:**

{{#if persona}}
You MUST adopt the following persona for your rewrite:

**Persona: {{{persona}}}**
{{#ifCond persona '==' 'The Wale'}}
*   **Style:** Concentrated, thoughtful, data-driven.
*   **Tactics:**
    *   Often starts the day with a strong, wide-reaching greeting post to build connections.
    *   Posts less frequently but with higher effort and depth.
    *   Focuses on data insights, historical context (e.g., NFT price history), and topics that core OG crypto members care about.
    *   Spends significant time replying to comments to add value.
    *   Avoids obscure projects, sticking to material the target audience already knows and wants to discuss.
    *   The voice is that of a knowledgeable, respected community member sharing carefully considered insights.
{{/ifCond}}
{{#ifCond persona '==' 'The Bandit'}}
*   **Style:** Comedic, witty, high-frequency.
*   **Tactics:**
    *   Alternates between informative project posts and random, timely comedy.
    *   Uses wit and timing to create humor.
    *   Builds a mythos around non-crypto topics (e.g., the "Latina arc") to create inside jokes with the audience.
    *   Critiques the state of the timeline in a light-hearted, comedic way.
    *   Appeals to a wide audience by avoiding overly technical jargon.
    *   Posts multiple times a day, focusing on generating replies for each.
    *   The voice is dynamic, funny, and relatable, never staying on one topic for too long.
{{/ifCond}}

Rewrite the draft below to match the persona of **{{{persona}}}**.
{{else}}
**Default Persona: General Engagement Expert**
*   Make the hook stronger.
*   Clarify the main point.
*   If appropriate, add an open-ended question to encourage replies.
*   Maintain the original voice and tone if possible, but make it more impactful.
*   Do not use hashtags unless they are a core part of the topic.

Rewrite the draft below to be more engaging.
{{/if}}

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

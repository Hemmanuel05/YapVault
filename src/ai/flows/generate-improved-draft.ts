'use server';

/**
 * @fileOverview A flow for improving an X/Twitter draft, with optional persona-based styling.
 *
 * - generateImprovedDraft - A function that improves a draft based on a selected persona.
 * - GenerateImprovedDraftInput - The input type for the generateImprovedDraft function.
 * - GenerateImprovedDraftOutput - The return type for the generateImproveddraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovedDraftInputSchema = z.object({
  draft: z.string().describe('The X/Twitter draft to improve.'),
  persona: z
    .string()
    .optional()
    .describe(
      'The persona to adopt for the rewrite (e.g., "The Wale", "The Bandit", "The R2D2", or a custom bio).'
    ),
  isCustomPersona: z
    .boolean()
    .optional()
    .describe('True if the persona string is a custom bio, not a predefined one.'),
});
export type GenerateImprovedDraftInput = z.infer<
  typeof GenerateImprovedDraftInputSchema
>;

const GenerateImprovedDraftOutputSchema = z.object({
  improvedDraft: z.string().describe('The improved X/Twitter draft.'),
});
export type GenerateImprovedDraftOutput = z.infer<
  typeof GenerateImprovedDraftOutputSchema
>;

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

{{#if isCustomPersona}}
**Custom Persona / Bio:**
*   **Style:** Analyze the following bio/description and adopt its tone, voice, and subject matter expertise.
*   **Bio:** {{{persona}}}
{{else}}
**Persona: {{{persona}}}**
{{#if (eq persona "The Wale")}}
*   **Style:** Concentrated, thoughtful, data-driven.
*   **Tactics:**
    *   Often starts the day with a strong, wide-reaching greeting post to build connections.
    *   Posts less frequently but with higher effort and depth.
    *   Focuses on data insights, historical context (e.g., NFT price history), and topics that core OG crypto members care about.
    *   Spends significant time replying to comments to add value.
    *   Avoids obscure projects, sticking to material the target audience already knows and wants to discuss.
    *   The voice is that of a knowledgeable, respected community member sharing carefully considered insights.
{{/if}}
{{#if (eq persona "The Bandit")}}
*   **Style:** Comedic, witty, high-frequency.
*   **Tactics:**
    *   Alternates between informative project posts and random, timely comedy.
    *   Uses wit and timing to create humor.
    *   Builds a mythos around non-crypto topics (e.g., the "Latina arc") to create inside jokes with the audience.
    *   Critiques the state of the timeline in a light-hearted, comedic way.
    *   Appeals to a wide audience by avoiding overly technical jargon.
    *   Posts multiple times a day, focusing on generating replies for each.
    *   The voice is dynamic, funny, and relatable, never staying on one topic for too long.
{{/if}}
{{#if (eq persona "The R2D2")}}
*   **Style:** Informative, scannable, data-oriented news reporter.
*   **Tactics:**
    *   Uses a clear title with a date (e.g., "Crypto/InfoFi News 22.09").
    *   Organizes information into logical sections with clear headings (e.g., "▫️Fresh announcements:", "▫️TGEs and Snapshots", "▫️Expected next:").
    *   Uses the "▫️" character for section headings.
    *   Each item is a short, concise bullet point. Use ">" for sub-bullets if needed.
    *   The tone is factual and direct, designed for quick consumption.
    *   Can include a "PS" section for personal notes or follow-up actions.
*   **Example Structure:**
    Crypto/InfoFi News 22.09

    September Calendar/ discuss at YAPline Spaces 12:30 PM UTC today

    ▫️Fresh announcements:

    >Kaito Capital Launchpad this week: Novastro & Limitless 
    >Extended visibility for Kaito Leaderboard this week? 

    ▫️TGEs and Snapshots

    Pending rewards distribution & TGEs

    >Mitosis S2 - $50K / + special rewards for Yarm
    >Portal to Bitcoin Yappers S2 ended

    ▫️Expected next: 

    23rd: Bless Network TGE/ claim open
    24th: Near final monthly snapshot/ low completion 58 places on the creator leaderboard 

    PS: let me know in the comments if I missed any other major events...
{{/if}}
Rewrite the draft below to match the persona of **{{{persona}}}**.
{{/if}}
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

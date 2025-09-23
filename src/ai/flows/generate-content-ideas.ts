'use server';

/**
 * @fileOverview A flow for generating content ideas based on a topic.
 *
 * - generateContentIdeas - A function that generates post ideas from a keyword or topic.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateContentIdeasInputSchema,
    GenerateContentIdeasOutputSchema,
    type GenerateContentIdeasInput,
} from '@/ai/schemas/generate-content-ideas';
import { GenerateContentIdeasOutput } from '@/ai/schemas/generate-content-ideas';
import { googleAI } from '@genkit-ai/googleai';

export async function generateContentIdeas(
  input: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: GenerateContentIdeasInputSchema},
  output: {schema: GenerateContentIdeasOutputSchema},
  prompt: `You are an expert social media strategist specializing in the crypto and AI space. Your task is to brainstorm engaging post ideas and hooks based on a user's topic.

Generate 5 distinct angles for the given topic. Each idea should be unique and target a different type of engagement.

**Topic:**
{{{topic}}}

**Content Angles to Generate:**

1.  **The Contrarian Take:** Generate a controversial or non-obvious opinion about the topic that will spark debate.
2.  **The Data-Driven Hook:** Create a hook that references a surprising (even if hypothetical) statistic or data point.
3.  **The "How-To" Angle:** Frame the topic as a mini-guide or a valuable tip.
4.  **The Forward-Looking Question:** Pose a thought-provoking question about the future of the topic.
5.  **The Simple Analogy:** Explain the topic using a simple, relatable analogy to make it more accessible.

For each, provide a title for the angle and the generated idea.
`,
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

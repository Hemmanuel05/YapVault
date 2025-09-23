'use server';

/**
 * @fileOverview A flow for analyzing a published post to provide feedback.
 *
 * - analyzePublishedPost - A function that provides a post-mortem analysis of a tweet.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzePublishedPostInputSchema,
    AnalyzePublishedPostOutputSchema,
    type AnalyzePublishedPostInput
} from '@/ai/schemas/analyze-published-post';
import { AnalyzePublishedPostOutput } from '@/ai/schemas/analyze-published-post';
import { googleAI } from '@genkit-ai/googleai';


export async function analyzePublishedPost(
  input: AnalyzePublishedPostInput
): Promise<AnalyzePublishedPostOutput> {
  return analyzePublishedPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePublishedPostPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: AnalyzePublishedPostInputSchema},
  output: {schema: AnalyzePublishedPostOutputSchema},
  prompt: `You are an expert X/Twitter growth strategist. Your task is to provide a "post-mortem" analysis of a user's published post.

Analyze the post based on the following criteria, which are known to be favored by the modern X algorithm:
- **Hook Strength:** How well does the opening grab attention?
- **Engagement Triggers:** Does it contain questions, debates, or calls to action that encourage replies?
- **Value Proposition:** Does it offer unique insight, data, or a valuable perspective (alpha)?
- **Authenticity & Voice:** Does it sound like a real person? Is the tone confident and clear?
- **Readability:** Is the formatting clean and easy to scan?

Based on your analysis, provide a structured feedback report.

**Post to Analyze:**
{{{postText}}}

**Instructions:**
1.  **Analyze What Worked:** Identify the strengths of the post. What did the user do well? This could be a strong hook, a good question, valuable data, or a clear voice.
2.  **Analyze What Could Be Improved:** Identify the weaknesses. Where did the user miss an opportunity? This could be a weak hook, no clear call to action, or a confusing message.
3.  **Calculate Missed Opportunity Score:** On a scale of 0 to 10, rate the missed opportunity.
    - **0-2:** A near-perfect post that maximized its potential.
    - **3-5:** A good post that could have been slightly better with minor tweaks.
    - **6-8:** A decent post that missed significant opportunities for engagement or clarity.
    - **9-10:** A post with good raw material but poor execution, representing a huge missed opportunity.

Provide the feedback now.
`,
});

const analyzePublishedPostFlow = ai.defineFlow(
  {
    name: 'analyzePublishedPostFlow',
    inputSchema: AnalyzePublishedPostInputSchema,
    outputSchema: AnalyzePublishedPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

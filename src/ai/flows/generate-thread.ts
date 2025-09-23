'use server';

/**
 * @fileOverview A flow for generating an X/Twitter thread from a topic.
 *
 * - generateThread - A function that generates a thread based on a topic and desired length.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateThreadInputSchema,
    GenerateThreadOutputSchema,
    type GenerateThreadInput,
} from '@/ai/schemas/generate-thread';
import { GenerateThreadOutput } from '@/ai/schemas/generate-thread';

export async function generateThread(
  input: GenerateThreadInput
): Promise<GenerateThreadOutput> {
  return generateThreadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThreadPrompt',
  input: {schema: GenerateThreadInputSchema},
  output: {schema: GenerateThreadOutputSchema},
  prompt: `You are an expert X/Twitter thread writer. Your task is to take the user's source material and create a compelling, easy-to-read thread with a specified number of posts.

**Instructions:**

1.  **Deconstruct the Source Material:** Break down the main topic from the source material into a logical sequence of points, with one main idea per post.
2.  **First Post (Hook):** The first post MUST be a strong hook to grab the reader's attention and make them want to read more.
3.  **Body Posts:** Each subsequent post should build on the last, providing more detail, examples, or arguments. Use clear language and simple sentences. Use line breaks to improve readability.
4.  **Final Post (Conclusion):** The last post should summarize the thread, offer a final takeaway, or ask a question to encourage engagement.
5.  **Numbering:** Each post in the thread MUST be numbered using the format (X/N) at the end, where X is the current post number and N is the total number of posts. For example: (1/{{{numPosts}}}), (2/{{{numPosts}}}), etc.
6.  **Character Limit:** Ensure each post is well under the 280-character limit to be safe.
7.  **Output Format:** Return the posts as an array of strings.

**Source Material:**
{{{sourceMaterial}}}

**Number of Posts:**
{{{numPosts}}}

Generate the thread now.
`,
});

const generateThreadFlow = ai.defineFlow(
  {
    name: 'generateThreadFlow',
    inputSchema: GenerateThreadInputSchema,
    outputSchema: GenerateThreadOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        if (!output) {
          return {
            thread: ['Error: The AI failed to generate a thread. The source material may be too short or unclear.']
          }
        }
        return output;
    } catch(e: any) {
        console.error("An error occurred in generateThreadFlow:", e);
        const errorMessage = e.message && e.message.includes('429') 
            ? "The AI service is rate-limited. Please try again shortly."
            : "An unexpected error occurred. Please check the console for details.";
        
        return {
            thread: [`Error: ${errorMessage}`]
        }
    }
  }
);

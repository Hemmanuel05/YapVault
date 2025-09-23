'use server';

/**
 * @fileOverview A flow for generating an X/Twitter thread from a topic.
 *
 * - generateThread - A function that generates a thread based on a topic and desired length.
 * - GenerateThreadInput - The input type for the generateThread function.
 * - GenerateThreadOutput - The return type for the generateThread function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThreadInputSchema = z.object({
  sourceMaterial: z.string().describe('The topic, source material, docs, or links for the thread.'),
  numPosts: z.number().min(2).max(25).describe('The number of posts to include in the thread.'),
});
export type GenerateThreadInput = z.infer<typeof GenerateThreadInputSchema>;

const GenerateThreadOutputSchema = z.object({
  thread: z.array(z.string()).describe('An array of strings, where each string is a single post in the thread.'),
});
export type GenerateThreadOutput = z.infer<typeof GenerateThreadOutputSchema>;

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
    const {output} = await prompt(input);
    return output!;
  }
);

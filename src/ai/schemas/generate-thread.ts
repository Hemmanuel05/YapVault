import {z} from 'genkit';

export const GenerateThreadInputSchema = z.object({
  sourceMaterial: z.string().describe('The topic, source material, docs, or links for the thread.'),
  numPosts: z.number().min(2).max(25).describe('The number of posts to include in the thread.'),
});
export type GenerateThreadInput = z.infer<typeof GenerateThreadInputSchema>;

export const GenerateThreadOutputSchema = z.object({
  thread: z.array(z.string()).describe('An array of strings, where each string is a single post in the thread.'),
});
export type GenerateThreadOutput = z.infer<typeof GenerateThreadOutputSchema>;

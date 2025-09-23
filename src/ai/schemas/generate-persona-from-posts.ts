import {z} from 'genkit';

export const GeneratePersonaFromPostsInputSchema = z.object({
  posts: z.array(z.string()).describe('An array of strings, where each string is a past post from the user.'),
});
export type GeneratePersonaFromPostsInput = z.infer<
  typeof GeneratePersonaFromPostsInputSchema
>;

export const GeneratePersonaFromPostsOutputSchema = z.object({
  persona: z.string().describe('The generated persona description, written as a concise bio.'),
});
export type GeneratePersonaFromPostsOutput = z.infer<
  typeof GeneratePersonaFromPostsOutputSchema
>;

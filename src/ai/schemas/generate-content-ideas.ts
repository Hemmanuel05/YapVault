import {z} from 'genkit';

export const GenerateContentIdeasInputSchema = z.object({
  topic: z.string().describe('The keyword or topic to brainstorm ideas for.'),
});
export type GenerateContentIdeasInput = z.infer<
  typeof GenerateContentIdeasInputSchema
>;

const IdeaSchema = z.object({
    title: z.string().describe("A short, catchy title for the content angle (e.g., 'The Contrarian Take')."),
    idea: z.string().describe("The generated post idea or hook."),
});

export const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(IdeaSchema).describe('An array of generated content ideas.'),
});
export type GenerateContentIdeasOutput = z.infer<
  typeof GenerateContentIdeasOutputSchema
>;


import {z} from 'genkit';

export const GenerateImprovedDraftInputSchema = z.object({
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

export const GenerateImprovedDraftOutputSchema = z.object({
  improvedDraft: z.string().describe('The improved X/Twitter draft.'),
});
export type GenerateImprovedDraftOutput = z.infer<
  typeof GenerateImprovedDraftOutputSchema
>;

import {z} from 'genkit';

export const GenerateAuthenticReplyInputSchema = z.object({
  originalPost: z.string().describe('The content of the X post to reply to.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo from the post, as a data URI that must include a MIME type and use Base64 encoding. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAuthenticReplyInput = z.infer<
  typeof GenerateAuthenticReplyInputSchema
>;

const EvaluationSchema = z.object({
    humanAuthenticity: z.number().min(1).max(10).describe("Sounds like a real person, not AI"),
    engagementPotential: z.number().min(1).max(10).describe("Likely to generate replies and interactions"),
    algorithmAppeal: z.number().min(1).max(10).describe("Follows X algorithm best practices"),
    controversyLevel: z.number().min(1).max(10).describe("1 = safe, 10 = highly provocative but respectful"),
    rudenessLevel: z.number().min(1).max(10).describe("1 = polite, 10 = hostile"),
    overallQuality: z.number().min(1).max(10),
});

export const GenerateAuthenticReplyOutputSchema = z.object({
  reply: z.string().describe('The clean, copy-paste ready reply.'),
  evaluation: EvaluationSchema.describe("The evaluation scores for the generated reply."),
});
export type GenerateAuthenticReplyOutput = z.infer<
  typeof GenerateAuthenticReplyOutputSchema
>;

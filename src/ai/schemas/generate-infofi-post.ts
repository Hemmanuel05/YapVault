import {z} from 'genkit';

export const GenerateInfoFiPostInputSchema = z.object({
  sourceMaterial: z.string().describe('The data, docs, or research to analyze.'),
});
export type GenerateInfoFiPostInput = z.infer<typeof GenerateInfoFiPostInputSchema>;

const PostVariationSchema = z.object({
  version: z.string().describe('The focus of this variation (e.g., "Technical Focus").'),
  content: z.string().describe('The optimized post content.'),
  target: z.string().describe('The target audience for this post.'),
  yapPotential: z.string().describe('The predicted Yap potential (High/Medium/Low).'),
});

export const GenerateInfoFiPostOutputSchema = z.object({
  analysisSummary: z.object({
    sourceMaterial: z.string().describe('A summary of what was analyzed.'),
    keyFinding: z.string().describe('The main technical insight found.'),
    marketRelevance: z.string().describe('Why this finding matters to the market right now.'),
  }),
  optimizedPosts: z.array(PostVariationSchema),
  recommendation: z.object({
    bestVersion: z.string().describe('Which version is recommended and why.'),
    timing: z.string().describe('When to post for maximum impact.'),
    followUp: z.string().describe('Potential thread expansion, related content ideas, or infographic suggestions.'),
  }),
});
export type GenerateInfoFiPostOutput = z.infer<typeof GenerateInfoFiPostOutputSchema>;

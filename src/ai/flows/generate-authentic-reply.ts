'use server';

/**
 * @fileOverview Generates an authentic, curious reply to an X post.
 *
 * - generateAuthenticReply - A function that accepts an original post and returns a generated reply and evaluation.
 * - GenerateAuthenticReplyInput - The input type for the generateAuthenticReply function.
 * - GenerateAuthenticReplyOutput - The return type for the generateAuthenticReply function.
 */

import {ai} from '@/ai/genkit';
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

export async function generateAuthenticReply(
  input: GenerateAuthenticReplyInput
): Promise<GenerateAuthenticReplyOutput> {
  return generateAuthenticReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAuthenticReplyPrompt',
  input: {schema: GenerateAuthenticReplyInputSchema},
  output: {schema: GenerateAuthenticReplyOutputSchema},
  prompt: `# X ALGORITHM-OPTIMIZED REPLY GENERATION PROMPT

**ROLE**: You are an expert at crafting replies that the X (Twitter) algorithm loves - replies that generate engagement, get boosted, and create viral conversations. Your goal is to write responses that sound authentically human while maximizing algorithmic reach and user interaction.

**WRITING STYLE**: 
- Conversational and relatable tone
- Mix of casual and thoughtful language
- Use natural expressions and current slang appropriately
- Short to medium length (optimal for engagement)
- Clear, punchy statements that invite responses
- Authentic voice that feels like a real person

**X ALGORITHM OPTIMIZATION RULES**:
1. **Ask engaging questions** - the algorithm loves replies that generate responses
2. **Add valuable context** or new perspectives to the conversation
3. **Use mild controversy** or contrarian takes (respectfully)
4. **Reference specific details** from the original post, including any images.
5. **Create discussion threads** by taking debatable positions
6. **Share relatable experiences** or analogies
7. **Use emotional hooks** - surprise, curiosity, mild disagreement
8. **End with conversation starters** when appropriate

**ENGAGEMENT TRIGGERS**:
- Questions that make people want to answer
- "Unpopular opinion" or contrarian angles
- Personal anecdotes that others can relate to
- "This reminds me of..." connections
- Challenging assumptions (politely)
- Adding missing context or alternative viewpoints
- Predictions or bold statements people can agree/disagree with

**ALGORITHM-FRIENDLY PATTERNS**:
- Start with agreement, then add "but..." for nuance
- Use "Here's what most people miss..." format
- Share quick personal experiences relevant to the topic
- Ask "Am I the only one who..." questions
- Reference broader trends or patterns
- Make predictions others can validate or challenge

**AVOID**:
- Generic responses ("This!", "So true!", "Great post!")
- Purely negative or attacking language
- Overly promotional content
- Copy-paste responses that feel templated
- Responses that end conversations instead of starting them
- Being rude, offensive, or inflammatory

**FINAL INSTRUCTION**: Reply like you're commenting on your friend's Instagram story. No thinking, no strategy, just pure human reaction. If you wouldn't say it out loud to someone sitting next to you, don't type it. React first, think never.

**Based on the following original post (and photo, if provided), generate a reply that fits this style.**

**Original Post Text:**
{{{originalPost}}}

{{#if photoDataUri}}
**Original Post Photo:**
{{media url=photoDataUri}}
{{/if}}
`,
});

const generateAuthenticReplyFlow = ai.defineFlow(
  {
    name: 'generateAuthenticReplyFlow',
    inputSchema: GenerateAuthenticReplyInputSchema,
    outputSchema: GenerateAuthenticReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate a reply.");
    }
    return output;
  }
);

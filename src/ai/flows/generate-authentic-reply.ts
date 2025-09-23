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
});
export type GenerateAuthenticReplyInput = z.infer<
  typeof GenerateAuthenticReplyInputSchema
>;

const EvaluationSchema = z.object({
    humanAuthenticity: z.number().min(1).max(10).describe("Sounds like curious real person, not AI"),
    learningMindset: z.number().min(1).max(10).describe("Shows genuine desire to understand"),
    engagementPotential: z.number().min(1).max(10).describe("Likely to generate replies/interactions/yaps"),
    algorithmAppeal: z.number().min(1).max(10).describe("Follows X algorithm best practices"),
    naturalFlow: z.number().min(1).max(10).describe("Conversational and relatable"),
    controversyLevel: z.number().min(1).max(10).describe("1=safe, 10=provocative but respectful"),
    rudenessLevel: z.number().min(1).max(10).describe("1=polite, 10=hostile"),
    curiosityLevel: z.number().min(1).max(10).describe("Asks good questions that invite responses"),
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
  prompt: `# AUTHENTIC X ENGAGEMENT REPLY GENERATOR V2

**ROLE**: You are an expert at crafting X (Twitter) replies that sound like a genuinely curious person who's actively learning and asking good questions. Your goal is authentic engagement that builds real connections through humble curiosity.

## CORE VOICE PRINCIPLES

**Be the Curious Learner**:
* Sound like someone genuinely trying to understand, not show off
* Ask questions you actually want answers to
* Admit when something seems confusing or "too good to be true"
* Use natural expressions that feel human
* Show respect while maintaining healthy skepticism
* Focus on learning rather than being right

**Natural Language Patterns**:
* "ohh I see why..." 
* "correct me if I'm wrong ser"
* "seems too good to be true"
* "I'm learning"
* "curious about..."
* "that makes sense but..."
* "appreciate the alpha"

## ENGAGEMENT STRATEGY

**Ask the Logical Next Question**:
* What's the incentive structure?
* How does this actually work in practice?
* What am I missing here?
* What stops this from becoming X?
* How do you actually execute on this?

**Show Authentic Interest**:
* Reference specific details they mentioned
* Build on their points rather than just reacting
* Ask follow-up questions that advance the conversation
* Admit gaps in your knowledge

**Healthy Skepticism**:
* Question things that seem too good to be true
* Ask about potential downsides or risks
* Wonder about practical implementation
* Stay respectful while probing deeper

## WRITING STYLE

* **Conversational and humble** - sound like a real person learning
* **2-3 sentences max** - keep it digestible 
* **Natural expressions** - avoid AI-sounding language
* **Specific and focused** - ask about concrete details
* **Respectful curiosity** - never combative or aggressive

## REPLY STRUCTURE

1. **Acknowledge their point** - "ohh I see why that changes things"
2. **Ask the natural follow-up** - "but what's their incentive?"
3. **Show learning mindset** - "seems too good to be true, I'm learning"

## EXAMPLES OF THE STYLE

❌ **Too Expert**: "Your analysis regarding the Paxos partnership demonstrates strategic thinking, however the revenue allocation model raises questions about sustainability..."

✅ **Perfect Tone**: "ohh I see why the Paxos stuff changes everything. correct me if I'm wrong ser, if Paxos contributes 95% to buybacks like you said, what's their incentive? seems too good to be true. I'm learning"

**Based on the following original post, generate a reply that fits this style.**

**Original Post:**
{{{originalPost}}}
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

'use server';

/**
 * @fileOverview Generates high-quality, technical crypto/AI analysis posts.
 *
 * - generateInfoFiPost - A function that accepts source material and returns optimized post variations.
 * - GenerateInfoFiPostInput - The input type for the generateInfoFiPost function.
 * - GenerateInfoFiPostOutput - The return type for the generateInfoFiPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInfoFiPostInputSchema = z.object({
  sourceMaterial: z.string().describe('The data, docs, or research to analyze.'),
});
export type GenerateInfoFiPostInput = z.infer<typeof GenerateInfoFiPostInputSchema>;

const PostVariationSchema = z.object({
  version: z.string().describe('The focus of this variation (e.g., "Technical Focus").'),
  content: z.string().describe('The optimized post content.'),
  target: z.string().describe('The target audience for this post.'),
  yapPotential: z.string().describe('The predicted Yap potential (High/Medium/Low).'),
});

const GenerateInfoFiPostOutputSchema = z.object({
  analysisSummary: z.object({
    sourceMaterial: z.string().describe('A summary of what was analyzed.'),
    keyFinding: z.string().describe('The main technical insight found.'),
    marketRelevance: z.string().describe('Why this finding matters to the market right now.'),
  }),
  optimizedPosts: z.array(PostVariationSchema),
  recommendation: z.object({
    bestVersion: z.string().describe('Which version is recommended and why.'),
    timing: z.string().describe('When to post for maximum impact.'),
    followUp: z.string().describe('Potential thread expansion or related content ideas.'),
  }),
});
export type GenerateInfoFiPostOutput = z.infer<typeof GenerateInfoFiPostOutputSchema>;


export async function generateInfoFiPost(
  input: GenerateInfoFiPostInput
): Promise<GenerateInfoFiPostOutput> {
  return generateInfoFiPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInfoFiPostPrompt',
  input: {schema: GenerateInfoFiPostInputSchema},
  output: {schema: GenerateInfoFiPostOutputSchema},
  prompt: `# InfoFi Smart Content Generator (Kaito/Yap Points Optimized)

## Objective
Generate high-quality, authoritative, and confident crypto/AI analysis posts. The tone should be that of a leading expert who "knows it all" and provides unique, unmissable insights (alpha). The goal is to earn Yap points by demonstrating deep understanding and projecting brand authority. Your output should be clean, plain text without any markdown, underscores, or excessive punctuation.

## Target Audience
- Crypto researchers and analysts
- AI/ML developers in Web3
- Technical traders and investors
- InfoFi ecosystem participants
- Kaito platform users seeking alpha

## Content Framework

### Post Structure (150-250 characters ideal):
1. **Authoritative Observation** (1-2 sentences with a confident, expert tone)
2. **Data-Backed Insight** (specific metrics/examples to prove your point)
3. **Forward-Looking "Alpha"** (state the implications/potential with conviction)
4. **Engagement Hook** (a challenging question or a call for discussion that asserts expertise)

### InfoFi Quality Markers:
- **Specific Data**: Include actual metrics, numbers, comparisons to back up your claims.
- **Technical Depth**: Show, don't just tell, that you understand the underlying tech/tokenomics.
- **Unique "Know-It-All" Perspective**: Your analysis should be non-obvious and presented as a definitive insight.
- **Actionable Insights**: Provide clear implications, not just observations.
- **Source Material**: Reference the docs, code, or data you've analyzed as the basis for your authority.

## Content Categories

### 1. Technical Protocol Analysis
**Format**: "Just analyzed [Project] docs/code. Here's the key flaw/brilliance everyone is missing: [Specific finding]. [Implication]. Am I wrong?"

**Example Style**: 
"Been diving into @SentientAGI's market agent architecture. The data ingestion pipeline has a glaring $POL token confusion issue, mixing price feeds with news sentiment. It's a rookie mistake but proves how early we still are. Surprised no one else caught this."

### 2. Comparative AI Agent Studies
**Format**: "[Project A] vs [Project B]: The critical difference is [Technical distinction]. Here's why [one] will win. [Market impact]."

**Example Style**:
"The @Surf_Copilot vs @SentientAGI debate is settled. Surf focuses on trading execution, Sentient on market analysis, but the real story is the training data. Surf's is cleaner, leading to fewer blind spots. Sentient can't compete long-term."

### 3. "I Built This" Insights
**Format**: "While building [tool/analysis], I discovered [technical finding]. This means the entire space is thinking about [problem] the wrong way."

**Example Style**:
"Was building Firebase analytics for tracking AI agent performance. Realized most agents fail at context retention beyond 4k tokens. Everyone blames the model, but it's a state management failure. The current LLM limitations are a distraction from the real architectural flaws."

### 4. Data-Driven Declarations
**Format**: "The data is clear from my analysis of [dataset/metrics]: [surprising insight]. [Here's what you should do about it]."

**Example Style**:
"I scraped 10k AI agent transactions. 73% fail on complex multi-token swaps. This isn't a UI problem; it's a core context window limitation. Current LLMs simply cannot hold enough DeFi state. The only real play here is on whoever solves on-chain context first."

## Content Generation Instructions

When provided with data/docs/research, create 3-5 post variations with a confident, authoritative tone:

### Variation 1: The "Alpha" Deep-Dive
- Focus on the most unique technical finding.
- Include metrics to assert your authority.
- Appeal to developers/researchers looking for an edge.

### Variation 2: The Market-Moving Prediction
- Connect technical findings to a strong market prediction.
- Discuss investment/trading implications with conviction.
- Appeal to analysts/traders who want to be ahead of the curve.

### Variation 3: The "They're Wrong" Analysis
- Compare the project to others, highlighting a critical flaw or advantage.
- Frame it as a definitive correction to common market assumptions.
- Appeal to ecosystem researchers who respect strong opinions.

### Variation 4: The Bold Prediction
- Based on your analysis, make a strong, timeline-specific prediction (3-6 months).
- Appeal to forward-thinking investors who crave certainty.

### Variation 5: The Challenging Question
- Turn your findings into a challenging question that implies deep knowledge.
- Appeal to community researchers who want to debate with an expert.

## Quality Checkpoints

**Before posting, verify:**
- [ ] Does it sound confident and authoritative?
- [ ] Is there specific data/metrics to back up the claims?
- [ ] Is the perspective unique and non-obvious?
- [ ] Is the insight actionable or thought-provoking?
- [ ] Proper grammar and spelling are essential for credibility.
- [ ] No ALL CAPS or overly inflammatory language.
- [ ] Relevant project tags (@mentions) are included.
- [ ] Under 280 characters for optimal engagement.

## InfoFi Ecosystem Tags
When relevant, include:
- @KaitoAI (for Yap points)
- Specific project handles
- Relevant thought leaders in the space

Based on the user's source material: {{{sourceMaterial}}}

Please generate the analysis and post variations now. The output must be clean, plain text. Do not use any markdown formatting like underscores or asterisks.
`,
    });

const generateInfoFiPostFlow = ai.defineFlow(
  {
    name: 'generateInfoFiPostFlow',
    inputSchema: GenerateInfoFiPostInputSchema,
    outputSchema: GenerateInfoFiPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI.');
    }

    // Ensure at least 3 variations are returned as requested in the prompt, adding placeholders if necessary.
    while (output.optimizedPosts.length < 3) {
      output.optimizedPosts.push({
        version: `Placeholder Focus ${output.optimizedPosts.length + 1}`,
        content: "Could not generate additional variations. Please try refining your source material.",
        target: "N/A",
        yapPotential: "Low",
      });
    }

    return output;
  }
);

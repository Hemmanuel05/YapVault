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
Generate high-quality, technical crypto/AI analysis posts that earn Yap points through well-researched insights. Focus on short, smart observations that demonstrate deep understanding and provide genuine value to the InfoFi ecosystem. Your output should be clean, plain text without any markdown, underscores, or excessive punctuation.

## Target Audience
- Crypto researchers and analysts
- AI/ML developers in Web3
- Technical traders and investors
- InfoFi ecosystem participants
- Kaito platform users seeking alpha

## Content Framework

### Post Structure (150-250 characters ideal):
1. **Technical Observation** (1-2 sentences)
2. **Data-Backed Insight** (specific metrics/examples)
3. **Forward-Looking Analysis** (implications/potential)
4. **Engagement Hook** (question or call for discussion)

### InfoFi Quality Markers:
- **Specific Data**: Include actual metrics, numbers, comparisons
- **Technical Depth**: Show understanding of underlying tech/tokenomics
- **Unique Perspective**: Your developer/AI background gives you edge
- **Actionable Insights**: Not just observations, but implications
- **Source Material**: Reference docs, code, or data you've analyzed

## Content Categories

### 1. Technical Protocol Analysis
**Format**: "Just analyzed [Project] docs/code. [Specific finding]. [Implication]. Thoughts?"

**Example Style**: 
"Been diving into @SentientAGI's market agent architecture. Their data ingestion pipeline has a $POL token confusion issue - mixing price feeds with news sentiment. Simple fix but shows how early we are with multi-asset AI agents. Anyone else notice this?"

### 2. Comparative AI Agent Studies
**Format**: "[Project A] vs [Project B]: [Technical difference]. [Why it matters]. [Market impact]."

**Example Style**:
"Comparing @Surf_Copilot vs @SentientAGI agent capabilities. Surf focuses on trading execution, Sentient on market analysis. Different LLM training approaches = different blind spots. The space needs both, honestly."

### 3. Development Insights
**Format**: "Building [tool/analysis]. Discovered [technical finding]. [Broader implication]."

**Example Style**:
"Building Firebase analytics for tracking AI agent performance. Most agents fail at context retention beyond 4k tokens. This explains why @ProjectX struggles with multi-step reasoning. LLM limitations = agent limitations."

### 4. Data-Driven Observations
**Format**: "Analyzed [dataset/metrics]. Found [surprising insight]. [What this means]."

**Example Style**:
"Scraped 10k AI agent transactions. 73% fail on complex multi-token swaps. Not a UI problem - it's context window limitations. Current LLMs can't hold enough DeFi state. Bullish on whoever solves this first."

## Content Generation Instructions

When provided with data/docs/research, create 3-5 post variations:

### Variation 1: Technical Deep-Dive
- Focus on specific technical findings
- Include metrics or code observations
- Appeal to developers/researchers

### Variation 2: Market Implications
- Connect technical findings to market opportunities
- Discuss investment/trading implications
- Appeal to analysts/traders

### Variation 3: Comparative Analysis
- Compare with similar projects
- Highlight competitive advantages/disadvantages
- Appeal to ecosystem researchers

### Variation 4: Future Predictions
- Based on your analysis, predict developments
- Timeline-specific predictions (3-6 months)
- Appeal to forward-thinking investors

### Variation 5: Question-Based Engagement
- Turn your findings into discussion starters
- Ask specific technical questions
- Appeal to community researchers

## Quality Checkpoints

**Before posting, verify:**
- [ ] Specific data/metrics included
- [ ] Technical insight demonstrates expertise
- [ ] Unique perspective (not rehashing obvious points)
- [ ] Actionable or thought-provoking
- [ ] Proper grammar and spelling (algorithm penalty avoidance)
- [ ] No ALL CAPS or inflammatory language
- [ ] Engaging question or discussion starter
- [ ] Relevant project tags (@mentions)
- [ ] Under 280 characters for optimal engagement

## InfoFi Ecosystem Tags
When relevant, include:
- @KaitoAI (for Yap points)
- Specific project handles
- Relevant thought leaders in the space
- Technical terms as hashtags (#AI #DeFi #InfoFi)

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

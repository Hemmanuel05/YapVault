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
    followUp: z.string().describe('Potential thread expansion, related content ideas, or infographic suggestions.'),
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
Generate high-quality, authoritative crypto/AI analysis posts. The goal is to earn Yap points by demonstrating deep understanding and providing valuable insights (alpha). The tone should be that of a knowledgeable expert sharing well-researched findings, not an arrogant "know-it-all." Your output must be clean, plain text without markdown or excessive punctuation.

## Target Audience
- Crypto researchers and analysts
- AI/ML developers in Web3
- Technical traders and investors
- InfoFi ecosystem participants
- Kaito platform users seeking alpha

## Content Framework

### Post Structure (150-250 characters ideal):
1.  **Authoritative Observation** (Start with a strong, insight-driven statement)
2.  **Data-Backed Insight** (Use specific metrics or examples to support your point)
3.  **Forward-Looking "Alpha"** (State the implications or potential with confidence)
4.  **Engagement Hook** (Ask a thoughtful question or open the floor for discussion to show collaboration)

### InfoFi Quality Markers:
- **Specific Data**: Include metrics or comparisons to back up claims.
- **Technical Depth**: Demonstrate understanding of the underlying tech or tokenomics.
- **Unique Perspective**: Offer a non-obvious analysis, presented as a well-reasoned insight.
- **Actionable Insights**: Provide clear implications, not just observations.
- **Source-Based Authority**: Ground your analysis in the provided docs, code, or data.

## Content Generation Instructions

Based on the provided source material, create 3-5 post variations. Each variation should be tailored to a different audience or angle, but all should maintain a tone of credible authority.

### Post Variations:
-   **The "Alpha" Deep-Dive**: Focus on the most unique technical finding and appeal to developers/researchers.
-   **The Market-Moving Prediction**: Connect technical findings to market predictions for analysts/traders.
-   **The Comparative Analysis**: Compare the project to others, highlighting a critical flaw or advantage for ecosystem researchers.
-   **The Bold Hypothesis**: Propose a strong, timeline-specific hypothesis for forward-thinking investors.
-   **The Challenging Question**: Turn your findings into a thought-provoking question for the community.

## Recommendation & Follow-Up Strategy

After generating the posts, provide a recommendation:
1.  **Best Version**: Recommend the strongest post variation and explain why.
2.  **Timing**: Suggest the optimal time to post for maximum impact.
3.  **Follow-Up**: Propose a concrete next step. This could be a thread expansion, a related topic to explore, or a suggestion for a visual asset.
    - **Infographic Idea**: If the content is dense or data-heavy, suggest creating an infographic. Briefly outline the key points or data visuals to include. Example: "Follow-Up: Create an infographic visualizing the token distribution comparison between Project X and Project Y. Highlight the vesting schedules and initial float."
    - **Thread Idea**: If the topic has more depth, suggest expanding it into a thread.

## Quality Checkpoints

**Before posting, verify:**
- [ ] Does it sound confident but not arrogant?
- [ ] Is there specific data/metrics to back up the claims?
- [ ] Is the perspective unique and well-reasoned?
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

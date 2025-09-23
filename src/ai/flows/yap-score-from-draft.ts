
'use server';

/**
 * @fileOverview Calculates a Yap score and Tweepcred score for a given X post draft.
 *
 * - yapScoreFromDraft - A function that accepts an X post draft and returns a Yap score and Tweepcred analysis.
 */

import {ai} from '@/ai/genkit';
import {
    YapScoreFromDraftInputSchema,
    YapScoreFromDraftOutputSchema,
    type YapScoreFromDraftInput
} from '@/ai/schemas/yap-score-from-draft';
import { YapScoreFromDraftOutput } from '@/ai/schemas/yap-score-from-draft';

export async function yapScoreFromDraft(input: YapScoreFromDraftInput): Promise<YapScoreFromDraftOutput> {
  return yapScoreFromDraftFlow(input);
}

const yapScorePrompt = ai.definePrompt({
  name: 'yapScorePrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: YapScoreFromDraftInputSchema},
  output: {schema: YapScoreFromDraftOutputSchema},
  prompt: `# X Algorithm Content Optimizer & Authority Analyst (2025)

## CONTEXT & OBJECTIVE
You are an expert X (Twitter) strategist. Your purpose is to analyze a post draft and predict its performance based on the 2025 algorithm, which values authentic engagement, authority, and "intellectual alpha." You must also assess its impact on the author's "TweetCred," an internal reputation score.

## ANALYSIS FRAMEWORK

### Author Context (If Provided)
{{#if authorFollowerCount}}
- **Author Authority:** HIGH. This user has {{authorFollowerCount}} followers. Their content should be evaluated as a thought leader. The "Small Account Advantage" does not apply. Instead, focus on the quality of the insight and its potential to lead a high-level discussion.
{{else}}
- **Author Authority:** STANDARD. This user is likely a small or emerging account. Prioritize authenticity, niche expertise, and engagement-driving questions.
{{/if}}

### Primary Analysis: Yap Score (1-10)
Analyze the draft to generate a "Yap Score" based on these weighted criteria:

**1. Intellectual Alpha & Insight (40% Weight)**
- Does the post offer a unique, non-obvious, or valuable perspective?
- Does it present a strong, coherent thesis or framework for thinking about a topic?
- Is it data-backed, even if conceptually?
- **High Score:** Presents a novel idea that makes people think.
- **Low Score:** Generic, widely known information.

**2. Hook Strength & Framing (25% Weight)**
- How well does the opening sentence grab attention and frame the topic?
- Does it create a curiosity gap or present a bold, contrarian statement?
- **High Score:** An immediate attention-grabber that forces the reader to continue.
- **Low Score:** A soft, passive opening.

**3. Discussion & Engagement Potential (25% Weight)**
- Does the post spark high-level debate or encourage others to share their own insights?
- This is different from a simple question. It's about the post's capacity to be a conversational centerpiece.
- **High Score:** The topic is debatable and has multiple layers.
- **Low Score:** A closed statement that is hard to build upon.

**4. Format & Readability (10% Weight)**
- Is the post easy to scan? Does it use formatting (line breaks, lists) to enhance clarity?
- Is the length optimal (150-250 characters)?

### Secondary Analysis: TweetCred (0-10)
Analyze the draft's impact on the author's reputation.

- **Reward:** Building credibility with valuable content, engaging genuinely, showing a learning process, supporting other creators.
- **Penalize:** Aggressive or offensive language, spammy content, or anything that could be seen as negative manipulation.
- **Specific Deboosts to Check For:**
  - Offensive Text: (80% reach reduction)
  - ALL CAPS TWEET: (Heavy penalty)
  - Including Links: (Penalty)
  - Low Text Quality (Spelling/Grammar): (Penalty)

- Based on this, predict a Tweepcred score and provide actionable suggestions to protect or enhance it.

### INSTRUCTIONS
Analyze the following draft. Provide a Yap Score, a Tweepcred score, sentiment, keywords, and actionable suggestions for both scores based on the complete framework above.

**Draft to Analyze:**
{{{draft}}}
`,
});

const yapScoreFromDraftFlow = ai.defineFlow(
  {
    name: 'yapScoreFromDraftFlow',
    inputSchema: YapScoreFromDraftInputSchema,
    outputSchema: YapScoreFromDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }

    let score = output.yapScore;

    // Apply keyword boosts
    const boostKeywords = ['GRID', 'ROMA', 'zkSync', 'Kaia', 'Sophon'];
    let keywordBoost = 0;
    for (const kw of boostKeywords) {
      if (input.draft.toLowerCase().includes(kw.toLowerCase())) {
          keywordBoost += 0.15 * 10; // 15% of the max score
      }
    }
    score += keywordBoost;

    // Apply sentiment weight
    if (output.sentiment.toLowerCase() === 'positive') {
      score *= 1.2; // Giving a 20% boost for positive sentiment
    } else if (output.sentiment.toLowerCase() === 'negative') {
      score *= 0.8;
    }

    // Clamp score between 0 and 10
    score = Math.max(0, Math.min(10, score));

    return {
        ...output,
        yapScore: parseFloat(score.toFixed(1)),
    };
  }
);

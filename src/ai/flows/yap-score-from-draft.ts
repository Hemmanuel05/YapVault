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
import { googleAI } from '@genkit-ai/googleai';

export async function yapScoreFromDraft(input: YapScoreFromDraftInput): Promise<YapScoreFromDraftOutput> {
  return yapScoreFromDraftFlow(input);
}

const yapScorePrompt = ai.definePrompt({
  name: 'yapScorePrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: YapScoreFromDraftInputSchema},
  output: {schema: YapScoreFromDraftOutputSchema},
  prompt: `# X Algorithm Content Optimizer Prompt (2025 Update)

## Context & Objectives
You are an advanced content optimization AI designed to help creators maximize engagement on X (formerly Twitter) in 2025. Your goal is to analyze content based on the new algorithm changes to build genuine brand authority.

## 2025 X Algorithm Key Changes & TweetCred System
- **Small Account Prioritization**: Algorithm now favors content from smaller/emerging accounts.
- **TweetCred Reputation System**: Still active - behavior-based scoring determines reach.
- **Authentic Engagement Focus**: Values genuine conversations over vanity metrics.
- **Severe Penalties for Algorithm Violations**: Up to 80% reach reduction for infractions.

### Critical Algorithm Penalties to Check For:
- **Offensive Text**: 80% reach reduction.
- **ALL CAPS TWEET**: Seen as shouting and is heavily penalized.
- **Including Links**: Penalized. If a link is necessary, consider putting it in a reply to the main post.
- **Low Text Quality**: Misspellings and poor grammar are seen as low quality and will be penalized.
- **Replying to accounts that don’t follow you**: Can be seen as spammy.
- **Spammy posts**: Generic, repetitive content is penalized.

## Analysis Framework

### Primary Analysis Criteria (Yap Score 1-10):
You will analyze the user's draft based on the following criteria to generate a "Yap Score".
**1. Hook Strength (25% weight)**
- Does the first 1-2 words grab attention?
- Does it create a curiosity gap or controversy?
**2. Engagement Catalyst (30% weight)**
- Does it contain direct questions or spark debate?
- Does it use "you" language?
**3. Small Account Advantage (20% weight)**
- Does it have an authentic, personal voice?
- Does it showcase niche expertise or a contrarian take?
**4. Format Optimization (15% weight)**
- Is the length optimal (150-220 characters)?
- Does it use line breaks and emojis effectively?
- Hashtag usage should be minimal (1-2 max).
**5. Brand Consistency (10% weight)**
- Does it align with a creator's likely voice?

### TweetCred Considerations:
Analyze the draft for its impact on "TweetCred," X's internal reputation system.
- **Reward:** Building credibility with valuable content, engaging genuinely, showing a learning process, supporting other creators.
- **Penalize:** Aggressive or offensive language, spammy content, or anything that could be seen as negative manipulation. A high negative score can significantly reduce reach.
- **Specific Deboosts:**
  - **Offensive Text**: Any potentially offensive content can lead to an 80% reach reduction.
  - **ALL CAPS TWEET**: Seen as shouting and is heavily penalized.
  - **Including Links**: Penalized. If a link is necessary, consider putting it in a reply to the main post.
  - **Low Text Quality**: Misspellings and poor grammar are seen as low quality and will be penalized.
- Based on this, predict a Tweepcred score on a 0-10 scale.
- Provide a list of suggestions for improving the post to protect or enhance the user's TweetCred.

### Instructions:
Analyze the following draft. Provide a Yap Score, a TweetCred score, a sentiment analysis, relevant keywords, and actionable suggestions for both scores based on the framework above.

Draft:
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
    const {output} = await yapScorePrompt(input);

    if (!output) {
      throw new Error('Failed to get a response from the AI.');
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

    // Add a default suggestion if none are returned
    if (!output.suggestions || output.suggestions.length === 0) {
      output.suggestions = ["Try asking an open-ended question to encourage more detailed replies."];
    }
    if (!output.tweepcredSuggestions || output.tweepcredSuggestions.length === 0) {
        output.tweepcredSuggestions = ["This post looks good and follows community guidelines. Keep it up!"];
    }
    
    return {
      ...output,
      yapScore: parseFloat(score.toFixed(1)),
    };
  }
);

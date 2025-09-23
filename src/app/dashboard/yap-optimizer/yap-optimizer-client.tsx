'use client';

import { useState } from 'react';
import { yapScoreFromDraft, YapScoreFromDraftOutput } from '@/ai/flows/yap-score-from-draft';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BotMessageSquare, Loader2 } from 'lucide-react';
import { YapScoreGauge } from '@/components/yap-score-gauge';
import { Badge } from '@/components/ui/badge';

export function YapOptimizerClient() {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<YapScoreFromDraftOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!draft.trim()) {
      toast({
        title: 'Draft is empty',
        description: 'Please enter some text to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await yapScoreFromDraft({ draft });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Analysis failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Post Draft</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your X post draft here... e.g. 'Excited for the zkSync airdrop! GRID is the future.'"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="text-base"
          />
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <BotMessageSquare />
            )}
            <span className="ml-2">Analyze & Predict Score</span>
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col items-center justify-center bg-card/50 min-h-[300px]">
        {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
        {!isLoading && !result && (
            <div className="text-center text-muted-foreground">
                <BotMessageSquare className="mx-auto h-12 w-12" />
                <p className="mt-2">Your analysis results will appear here.</p>
            </div>
        )}
        {result && (
            <div className="flex w-full flex-col items-center p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Predicted Yap Score</p>
                <YapScoreGauge score={result.yapScore} />
                <div className="mt-4 grid w-full gap-4 text-center sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Sentiment</p>
                        <Badge variant={getSentimentBadgeVariant(result.sentiment)} className="capitalize">{result.sentiment}</Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                        {result.keywords.length > 0 ? result.keywords.map(kw => <Badge key={kw} variant="outline">{kw}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
                        </div>
                    </div>
                </div>
                <div className="mt-6 w-full text-left">
                  <h4 className="font-semibold mb-2">Suggestions:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {result.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                  </ul>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
}

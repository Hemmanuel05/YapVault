'use client';

import { useState } from 'react';
import { analyzePublishedPost, AnalyzePublishedPostOutput } from '@/ai/flows/analyze-published-post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, SearchCheck, ThumbsUp, Lightbulb, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useActivityLog } from '@/hooks/use-activity-log';

export function PostMortemClient() {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePublishedPostOutput | null>(null);
  const { toast } = useToast();
  const { addActivity } = useActivityLog();

  const handleAnalyze = async () => {
    if (!postText.trim()) {
      toast({
        title: 'Post is empty',
        description: 'Please paste the text of the post you want to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzePublishedPost({ postText });
      setResult(analysisResult);
      addActivity({
        feature: 'Post-Mortem Analyzer',
        action: 'Analyzed Post',
        details: `Analyzed post: "${postText.substring(0, 40)}..."`,
      });
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
  
  const OpportunityScoreIndicator = ({ score }: { score: number }) => {
    const getColor = () => {
        if (score > 8) return 'text-red-500';
        if (score > 5) return 'text-yellow-500';
        return 'text-green-500';
    }

    return (
        <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><TrendingUp /> Missed Opportunity</h3>
            <div className={cn("text-6xl font-bold", getColor())}>
                {score.toFixed(1)}
                <span className="text-3xl text-muted-foreground">/10</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                {score > 8 && 'A huge missed opportunity. The core idea had potential but execution was weak.'}
                {score > 5 && score <= 8 && 'A decent post, but missed some key chances for better engagement.'}
                {score <= 5 && 'A strong post that effectively captured its potential.'}
            </p>
        </div>
    )
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Published Post</CardTitle>
          <CardDescription>
            Paste the exact text of a post you have already published.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Just analyzed the new tokenomics for Project X. The vesting schedule seems aggressive...'"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={8}
            className="text-base"
          />
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SearchCheck />
            )}
            <span className="ml-2">Analyze Post</span>
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!isLoading && !result && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="text-muted-foreground">
                    <SearchCheck className="mx-auto h-12 w-12" />
                    <p className="mt-2">Your post analysis will appear here.</p>
                </div>
            </div>
        )}

        {result && (
            <Card className={cn("animate-in fade-in-0 slide-in-from-bottom-5 duration-500")}>
                <CardHeader>
                    <CardTitle>Post-Mortem Analysis</CardTitle>
                    <CardDescription>Learn from your content to get better with every post.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <OpportunityScoreIndicator score={result.missedOpportunityScore} />
                    
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-green-500"><ThumbsUp /> What Worked Well</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {result.whatWorked.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                         <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-yellow-500"><Lightbulb /> What Could Be Improved</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {result.couldBeImproved.map((item, index) => <li key={index}>{item}</li>)}
                                {result.couldBeImproved.length === 0 && <li>Great work, this post was solid!</li>}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

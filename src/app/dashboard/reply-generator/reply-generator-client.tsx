'use client';

import { useState } from 'react';
import { generateAuthenticReply, GenerateAuthenticReplyOutput } from '@/ai/flows/generate-authentic-reply';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Check, MessageCircleQuestion, Star, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function ReplyGeneratorClient() {
  const [originalPost, setOriginalPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAuthenticReplyOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!originalPost.trim()) {
      toast({
        title: 'Original post is empty',
        description: 'Please paste the text of the post you want to reply to.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const replyResult = await generateAuthenticReply({ originalPost });
      setResult(replyResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const EvaluationMetric = ({ label, score }: { label: string; score: number }) => (
    <div className="flex items-center justify-between text-sm">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1 font-semibold">
        <Star className={cn("w-4 h-4", score > 7 ? "text-yellow-400" : "text-muted-foreground/50")} fill={score > 7 ? "currentColor" : "none"}/>
        <span>{score.toFixed(1)}/10</span>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Original Post</CardTitle>
          <CardDescription>
            Paste the content of the X post you want to reply to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Just launched my new DeFi project, it revolutionizes yield farming by...'"
            value={originalPost}
            onChange={(e) => setOriginalPost(e.target.value)}
            rows={8}
            className="text-base"
          />
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            <span className="ml-2">Generate Authentic Reply</span>
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
                    <MessageCircleQuestion className="mx-auto h-12 w-12" />
                    <p className="mt-2">Your generated reply will appear here.</p>
                </div>
            </div>
        )}

        {result && (
            <div className="space-y-4">
                 <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
                    <CardHeader>
                        <CardTitle>Generated Reply</CardTitle>
                        <CardDescription>A curious, authentic reply designed to spark conversation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            <p className="text-base whitespace-pre-wrap font-mono p-4 bg-muted rounded-md">{result.reply}</p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleCopy(result.reply)}
                            >
                                {isCopied ? <Check className="text-primary" /> : <Copy />}
                                <span className="ml-2">{isCopied ? 'Copied!' : 'Copy Reply'}</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card className={cn("animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart /> Evaluation</CardTitle>
                        <CardDescription>Analysis of the generated reply's potential impact.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <EvaluationMetric label="Overall Quality" score={result.evaluation.overallQuality} />
                        <Separator/>
                        <EvaluationMetric label="Human Authenticity" score={result.evaluation.humanAuthenticity} />
                        <EvaluationMetric label="Learning Mindset" score={result.evaluation.learningMindset} />
                        <EvaluationMetric label="Engagement Potential" score={result.evaluation.engagementPotential} />
                        <EvaluationMetric label="Curiosity Level" score={result.evaluation.curiosityLevel} />
                        <EvaluationMetric label="Algorithm Appeal" score={result.evaluation.algorithmAppeal} />
                        <Separator/>
                        <EvaluationMetric label="Rudeness Level" score={result.evaluation.rudenessLevel} />
                    </CardContent>
                </Card>
          </div>
        )}
      </div>
    </div>
  );
}

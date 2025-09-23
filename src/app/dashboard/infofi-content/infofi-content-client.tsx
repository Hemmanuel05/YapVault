'use client';

import { useState } from 'react';
import { generateInfoFiPost, GenerateInfoFiPostOutput } from '@/ai/flows/generate-infofi-post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export function InfoFiContentClient() {
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateInfoFiPostOutput | null>(null);
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);

  const handleGenerate = async () => {
    if (!sourceMaterial.trim()) {
      toast({
        title: 'Source Material is empty',
        description: 'Please enter some research or data to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const generationResult = await generateInfoFiPost({ sourceMaterial });
      setResult(generationResult);
      setCopiedStates(new Array(generationResult.optimizedPosts.length).fill(false));
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

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    const newCopiedStates = [...copiedStates];
    newCopiedStates[index] = true;
    setCopiedStates(newCopiedStates);
    setTimeout(() => {
        const resetCopiedStates = [...newCopiedStates];
        resetCopiedStates[index] = false;
        setCopiedStates(resetCopiedStates);
    }, 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Source Material</CardTitle>
          <CardDescription>Enter your data, research, code snippets, or analysis below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Analyzed @ProjectX's new agent. Uses GPT-4 but has a 2-second response time...'"
            value={sourceMaterial}
            onChange={(e) => setSourceMaterial(e.target.value)}
            rows={12}
            className="text-base font-mono"
          />
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span className="ml-2">Generate Posts</span>
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!isLoading && !result && (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="text-muted-foreground">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <p className="mt-2">Your generated content will appear here.</p>
                </div>
            </div>
        )}

        {result && (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-semibold">Source Material</h4>
                            <p className="text-muted-foreground">{result.analysisSummary.sourceMaterial}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Key Finding</h4>
                            <p className="text-muted-foreground">{result.analysisSummary.keyFinding}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Market Relevance</h4>
                            <p className="text-muted-foreground">{result.analysisSummary.marketRelevance}</p>
                        </div>
                    </CardContent>
                </Card>

                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {result.optimizedPosts.map((post, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold">{post.version}</AccordionTrigger>
                            <AccordionContent>
                                <Card className="bg-card/50">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <p className="text-base whitespace-pre-wrap">{post.content}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2 text-xs">
                                                   <Badge variant="outline">Target: {post.target}</Badge>
                                                   <Badge variant={post.yapPotential.toLowerCase() === 'high' ? 'default' : 'secondary'}>
                                                        Yap Potential: {post.yapPotential}
                                                   </Badge>
                                                </div>
                                                <Button size="icon" variant="ghost" onClick={() => handleCopy(post.content, index)}>
                                                    {copiedStates[index] ? <Check className="text-primary" /> : <Copy />}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>🎯 Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-semibold">Best Version</h4>
                            <p className="text-muted-foreground">{result.recommendation.bestVersion}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Posting Strategy</h4>
                            <p className="text-muted-foreground">{result.recommendation.timing}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Follow-up Opportunities</h4>
                            <p className="text-muted-foreground">{result.recommendation.followUp}</p>
                        </div>
                    </CardContent>
                </Card>
            </>
        )}
      </div>
    </div>
  );
}

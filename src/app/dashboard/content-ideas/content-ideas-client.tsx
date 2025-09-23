'use client';

import { useState } from 'react';
import { generateContentIdeas, GenerateContentIdeasOutput } from '@/ai/flows/generate-content-ideas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Check, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export function ContentIdeasClient() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateContentIdeasOutput | null>(null);
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);
  const { toast } = useToast();
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic is empty',
        description: 'Please enter a topic to brainstorm ideas.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setSelectedIdea(null);

    try {
      const ideasResult = await generateContentIdeas({ topic });
      setResult(ideasResult);
      setCopiedStates(new Array(ideasResult.ideas.length).fill(false));
    } catch (error)      {
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
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Brainstorming Topic</CardTitle>
            <CardDescription>
              Enter a keyword or general topic you want to post about.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="e.g., 'AI agents', 'zkSync', 'crypto market sentiment'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wand2 />
              )}
              <span className="ml-2">Generate Ideas</span>
            </Button>
          </CardContent>
        </Card>

        {selectedIdea !== null && (
             <Card className="animate-in fade-in-50">
                <CardHeader>
                    <CardTitle>Refine Your Idea</CardTitle>
                    <CardDescription>
                        You can edit and polish the selected idea here before using it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={selectedIdea} 
                        onChange={(e) => setSelectedIdea(e.target.value)}
                        rows={5}
                        className="font-mono"
                    />
                </CardContent>
             </Card>
        )}
      </div>
      
      <div className="space-y-4">
        {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!isLoading && !result && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed text-center">
                <div className="text-muted-foreground">
                    <Lightbulb className="mx-auto h-12 w-12" />
                    <p className="mt-2">Your generated ideas will appear here.</p>
                </div>
            </div>
        )}

        {result && (
            <div className="space-y-4">
                 <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
                    <CardHeader>
                        <CardTitle>Generated Ideas</CardTitle>
                        <CardDescription>Click an idea to select it for refinement.</CardDescription>
                    </CardHeader>
                </Card>
                {result.ideas.map((idea, index) => (
                <div
                    key={index}
                    className={cn("animate-in fade-in-0 slide-in-from-bottom-5 duration-500")}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <Card 
                        className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
                        onClick={() => setSelectedIdea(idea.idea)}
                    >
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                            <Badge variant="outline">{idea.title}</Badge>
                            <p className="text-base text-foreground">{idea.idea}</p>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(idea.idea, index)
                            }}
                        >
                            {copiedStates[index] ? (
                            <Check className="text-primary" />
                            ) : (
                            <Copy />
                            )}
                        </Button>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

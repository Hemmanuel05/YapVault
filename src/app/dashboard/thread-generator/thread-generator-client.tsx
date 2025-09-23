'use client';

import { useState } from 'react';
import { generateThread, GenerateThreadOutput } from '@/ai/flows/generate-thread';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Check, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityLog } from '@/hooks/use-activity-log';

export function ThreadGeneratorClient() {
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [numPosts, setNumPosts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateThreadOutput | null>(null);
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);
  const { toast } = useToast();
  const { addActivity } = useActivityLog();

  const handleGenerate = async () => {
    if (!sourceMaterial.trim()) {
      toast({
        title: 'Source material is empty',
        description: 'Please enter a topic, notes, or links to generate a thread.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const threadResult = await generateThread({ sourceMaterial, numPosts });
      setResult(threadResult);
      setCopiedStates(new Array(threadResult.thread.length).fill(false));
      addActivity({
        feature: 'Thread Generator',
        action: 'Generated Thread',
        details: `Generated a ${numPosts}-post thread on: "${sourceMaterial.substring(0, 30)}..."`,
      });
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
          <CardTitle>Thread Source Material</CardTitle>
          <CardDescription>
            Provide the AI with notes, research, or content to analyze. Please
            paste the content from any links directly, as the AI cannot access
            external websites.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Source Material</Label>
            <Textarea
              id="topic"
              placeholder="e.g., Paste a link to a whitepaper, some documentation, or your raw notes..."
              value={sourceMaterial}
              onChange={(e) => setSourceMaterial(e.target.value)}
              rows={6}
              className="text-base"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="num-posts">
              Number of Posts: <span className="font-bold">{numPosts}</span>
            </Label>
            <Slider
              id="num-posts"
              min={2}
              max={25}
              step={1}
              value={[numPosts]}
              onValueChange={(value) => setNumPosts(value[0])}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            <span className="ml-2">Generate Thread</span>
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
              <MessageSquareQuote className="mx-auto h-12 w-12" />
              <p className="mt-2">Your generated thread will appear here.</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
                <CardHeader>
                    <CardTitle>Generated Thread</CardTitle>
                    <CardDescription>Copy each post below and publish them on X in order.</CardDescription>
                </CardHeader>
            </Card>
            {result.thread.map((post, index) => (
              <div
                key={index}
                className={cn("animate-in fade-in-0 slide-in-from-bottom-5 duration-500")}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                          <p className="whitespace-pre-wrap font-mono text-sm">{post}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(post, index)}
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

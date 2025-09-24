'use client';

import { useState } from 'react';
import { generateAuthenticReply } from '@/ai/flows/generate-authentic-reply';
import { type GenerateAuthenticReplyOutput } from '@/ai/schemas/generate-authentic-reply';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Copy, Check, MessageCircleQuestion, Star, BarChart, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useActivityLog } from '@/hooks/use-activity-log';

export function ReplyGeneratorClient() {
  const [originalPost, setOriginalPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAuthenticReplyOutput | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addActivity } = useActivityLog();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalPost.trim() && !image) {
      toast({
        title: 'Post is empty',
        description: 'Please provide some text or an image for the original post.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const replyResult = await generateAuthenticReply({ originalPost, photoDataUri: image || undefined });
      setResult(replyResult);
      addActivity({
        feature: 'Authentic Reply',
        action: 'Generated Reply',
        details: `Replied to post: "${originalPost.substring(0, 40)}..."`,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast({
        title: 'Generation failed',
        description: errorMessage,
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
            Paste the content and optionally upload an image from the X post you want to reply to.
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

          {image ? (
            <div className="relative">
              <Image src={image} alt="Uploaded post image" width={500} height={300} className="rounded-lg object-cover w-full aspect-video" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => {
                  setImage(null);
                  setImageFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:underline">
                  <Paperclip className="h-4 w-4" />
                  Attach Image (Optional)
              </label>
              <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden"
              />
            </div>
          )}

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
                        <EvaluationMetric label="Engagement Potential" score={result.evaluation.engagementPotential} />
                        <EvaluationMetric label="Algorithm Appeal" score={result.evaluation.algorithmAppeal} />
                        <EvaluationMetric label="Controversy Level" score={result.evaluation.controversyLevel} />
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

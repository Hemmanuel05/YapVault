'use client';

import { useState } from 'react';
import { yapScoreFromDraft, YapScoreFromDraftOutput } from '@/ai/flows/yap-score-from-draft';
import { generateImprovedDraft } from '@/ai/flows/generate-improved-draft';
import { generatePersonaFromPosts } from '@/ai/flows/generate-persona-from-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BotMessageSquare, Loader2, Wand2, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import { YapScoreGauge } from '@/components/yap-score-gauge';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useActivityLog } from '@/hooks/use-activity-log';

function GeneratePersonaDialog({ onPersonaGenerated, children }: { onPersonaGenerated: (persona: string) => void, children: React.ReactNode }) {
  const [posts, setPosts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { addActivity } = useActivityLog();

  const handleGenerate = async () => {
    const postArray = posts.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (postArray.length < 3) {
      toast({
        title: 'Not enough posts',
        description: 'Please provide at least 3 posts, each on a new line.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { persona } = await generatePersonaFromPosts({ posts: postArray });
      onPersonaGenerated(persona);
      addActivity({
        feature: 'Persona Generator',
        action: 'Generated Persona',
        details: `Generated a custom persona from ${postArray.length} posts.`,
      });
      toast({
        title: 'Persona Generated!',
        description: 'The custom persona has been populated for you.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate a persona. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Generate "Voice Clone" Persona</DialogTitle>
          <DialogDescription>
            Paste 3-10 of your past posts (one per line). The AI will analyze them to create a custom persona that matches your voice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="past-posts"
            placeholder="- Just analyzed the new tokenomics for Project X...\n- My thoughts on the latest L2 scaling solution...\n- Here's why most people are wrong about AI agents..."
            value={posts}
            onChange={(e) => setPosts(e.target.value)}
            rows={10}
            className="font-mono"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generate Persona
          </Button>
        </DialogFooter>
      </DialogContent>
    )
}

export function YapOptimizerClient() {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<YapScoreFromDraftOutput | null>(null);
  const { toast } = useToast();
  const [persona, setPersona] = useState<string>('default');
  const [customPersona, setCustomPersona] = useState('');
  const { addActivity } = useActivityLog();

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
      addActivity({
        feature: 'Yap Optimizer',
        action: 'Analyzed Draft',
        details: `Predicted Yap score for draft: "${draft.substring(0, 40)}..."`,
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

  const handleFixTweet = async () => {
    if (!draft.trim()) {
      toast({
        title: 'Draft is empty',
        description: 'Please enter some text to improve.',
        variant: 'destructive',
      });
      return;
    }
    if (persona === 'custom' && !customPersona.trim()) {
      toast({
        title: 'Custom Persona is empty',
        description: 'Please enter a bio or description for your custom persona.',
        variant: 'destructive',
      });
      return;
    }

    setIsFixing(true);

    try {
      const isCustomPersona = persona === 'custom';
      const personaToSend = isCustomPersona ? customPersona : (persona === 'default' ? undefined : persona);
      
      const { improvedDraft } = await generateImprovedDraft({ 
        draft, 
        persona: personaToSend,
        isCustomPersona,
      });

      setDraft(improvedDraft);
      addActivity({
        feature: 'Yap Optimizer',
        action: 'Improved Draft',
        details: `Rewrote draft using ${isCustomPersona ? 'a custom' : persona} persona.`,
      });
      // Clear previous results as the draft has changed
      setResult(null);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to fix tweet',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFixing(false);
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
          <CardDescription>Analyze a post or have the AI rewrite it for you using a specific persona.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your X post draft here... e.g. 'Excited for the zkSync airdrop! GRID is the future.'"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="text-base"
          />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAnalyze} disabled={isLoading || isFixing} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <BotMessageSquare />
                )}
                <span className="ml-2">Analyze & Predict Score</span>
              </Button>
              <Button onClick={handleFixTweet} disabled={isFixing || isLoading} variant="outline" className="w-full">
                  {isFixing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wand2 />
                  )}
                  <span className="ml-2">Fix Tweet</span>
                </Button>
            </div>
            <div className="space-y-2">
                <Label>Rewrite Persona</Label>
                <Select value={persona} onValueChange={setPersona}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="The Wale">The Wale</SelectItem>
                    <SelectItem value="The Bandit">The Bandit</SelectItem>
                    <SelectItem value="The R2D2">The R2D2</SelectItem>
                    <SelectItem value="custom">Custom Persona</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {persona === 'custom' && (
              <div className="space-y-2 animate-in fade-in-50">
                <div className="flex justify-between items-center">
                    <Label htmlFor="custom-persona">Custom Persona Bio</Label>
                    <GeneratePersonaDialog onPersonaGenerated={(p) => setCustomPersona(p)}>
                         <Button variant="link" size="sm" className="p-0 h-auto text-accent">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Generate with AI
                        </Button>
                    </GeneratePersonaDialog>
                </div>
                <Textarea
                  id="custom-persona"
                  placeholder="e.g., 'Crypto researcher focused on DeFi. I write technical threads for an audience of developers and analysts.' Or, click 'Generate with AI' to clone your voice."
                  value={customPersona}
                  onChange={(e) => setCustomPersona(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="relative flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm min-h-[480px] overflow-hidden">
        {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
        {!isLoading && !result && (
          <div className="text-center text-muted-foreground p-8">
            <BotMessageSquare className="mx-auto h-12 w-12" />
            <p className="mt-4 text-lg">Your analysis results will appear here.</p>
            <p className="text-sm">Enter a draft and click analyze to see the magic.</p>
          </div>
        )}
        {result && (
          <TooltipProvider>
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-tr from-background via-card to-accent/20"
              style={{
                maskImage: 'radial-gradient(ellipse 80% 50% at 50% -20%,black 40%,transparent 100%)'
              }}
            />
            <div className="flex w-full flex-col items-center p-6 text-center animate-in fade-in-50 duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 delay-200">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground">Predicted Yap Score</p>
                  <YapScoreGauge score={result.yapScore} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-muted-foreground">Tweepcred Score</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Tweepcred is your X reputation score. A higher score improves reach.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <YapScoreGauge score={result.tweepcredScore} />
                </div>
              </div>

              <div className={cn("grid w-full max-w-md gap-4 text-center sm:grid-cols-2 mt-6", "animate-in fade-in-0 slide-in-from-bottom-10 duration-500 delay-300")}>
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

              <Separator className={cn("my-6 max-w-md", "animate-in fade-in-0 duration-500 delay-400")} />

              <div className={cn("grid w-full max-w-md gap-6 text-left md:grid-cols-2", "animate-in fade-in-0 slide-in-from-bottom-10 duration-500 delay-500")}>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><BotMessageSquare className="h-4 w-4 text-primary" /> Yap Suggestions:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {result.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Tweepcred Suggestions:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {result.tweepcredSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

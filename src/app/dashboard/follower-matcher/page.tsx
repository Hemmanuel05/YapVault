'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { followerMatches, Follower } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquarePlus, Search } from 'lucide-react';
import { generateDraftSuggestions } from '@/ai/flows/generate-draft-suggestions';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

export default function FollowerMatcherPage() {
  const [handle, setHandle] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<Follower[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDm, setGeneratedDm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Follower | null>(null);

  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setIsSearching(true);
    setMatches([]);
    // Simulate API call
    setTimeout(() => {
      const keywords = ['defi', 'ai', 'web3', 'zksync', 'grid', 'sophon', 'kaia'];
      const filtered = followerMatches
        .filter(f => f.followers > 1000 && keywords.some(kw => f.bio.toLowerCase().includes(kw)))
        .sort((a,b) => b.followers - a.followers)
        .slice(0, 5);
      
      setMatches(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const handleGenerateDm = async (user: Follower) => {
    setSelectedUser(user);
    setGeneratedDm('');
    setIsGenerating(true);
    try {
        const result = await generateDraftSuggestions({
            trendingTopic: `A direct message to ${user.name} (${user.handle}) who is interested in ${user.bio}`,
            successfulPastPosts: ["Hey, saw we have a mutual interest in Web3, let's connect!", "Love your work in the DeFi space, would be great to chat."],
        });
        if (result.draftSuggestions && result.draftSuggestions.length > 0) {
            setGeneratedDm(result.draftSuggestions[0]);
        }
    } catch (error) {
        console.error(error);
        toast({
            title: 'DM Generation Failed',
            description: 'Could not generate a DM. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Follower Matcher"
        description="Find high-value followers from any X handle and generate personalized DMs."
      />

      <Card>
        <CardHeader>
          <CardTitle>Find Potential Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter X handle (e.g., @kaito)"
              className="text-base"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isSearching && <div className="flex justify-center p-8"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}

      {matches.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Top 5 Matches</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {matches.map(match => (
                    <Card key={match.handle}>
                        <CardContent className="flex flex-col items-center p-6 text-center">
                            <Avatar className="mb-4 h-20 w-20">
                                <AvatarImage src={match.avatar} alt={match.name} />
                                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{match.name}</p>
                            <p className="text-sm text-muted-foreground">{match.handle}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {new Intl.NumberFormat().format(match.followers)} followers
                            </p>
                            <p className="mt-2 text-xs">{match.bio}</p>
                            <Sheet>
                                <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => handleGenerateDm(match)}>
                                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                                    Generate DM
                                </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Generated DM for {selectedUser?.name}</SheetTitle>
                                        <SheetDescription>
                                            Here is a personalized DM template. Feel free to edit it before sending.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4">
                                        {isGenerating && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                                        {!isGenerating && generatedDm && (
                                            <Textarea value={generatedDm} onChange={e => setGeneratedDm(e.target.value)} rows={10} className="text-base" />
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

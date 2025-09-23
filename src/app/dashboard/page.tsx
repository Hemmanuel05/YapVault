import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  BotMessageSquare,
  MessageSquareQuote,
  Sparkles,
  Lightbulb,
  MessageCircleQuestion,
  Trophy,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { leaderboardData, trendingProjects } from '@/lib/mock-data';

const features = [
  {
    title: 'Yap Optimizer',
    description:
      'Analyze your X/Twitter drafts to predict Yap scores and optimize for engagement within the Kaito community.',
    href: '/dashboard/yap-optimizer',
    icon: <BotMessageSquare className="mb-4 h-8 w-8 text-accent" />,
  },
  {
    title: 'InfoFi Content',
    description:
      'Generate high-quality, technical crypto/AI analysis posts that earn Yap points with well-researched insights.',
    href: '/dashboard/infofi-content',
    icon: <Sparkles className="mb-4 h-8 w-8 text-accent" />,
  },
  {
    title: 'Thread Generator',
    description:
      'Craft compelling X threads from a single topic, optimized for engagement and readability.',
    href: '/dashboard/thread-generator',
    icon: <MessageSquareQuote className="mb-4 h-8 w-8 text-accent" />,
  },
  {
    title: 'Content Ideas',
    description:
      "Overcome writer's block by generating creative post ideas and hooks from a single topic.",
    href: '/dashboard/content-ideas',
    icon: <Lightbulb className="mb-4 h-8 w-8 text-accent" />,
  },
  {
    title: 'Authentic Reply',
    description:
      'Craft replies that the X algorithm loves, maximizing reach and sparking genuine conversations.',
    href: '/dashboard/reply-generator',
    icon: <MessageCircleQuestion className="mb-4 h-8 w-8 text-accent" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to Your Kaito Kompass"
        description="Your all-in-one toolkit for navigating the Web3 social landscape."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content: Leaderboard and Trending */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Yap Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers in the Kaito ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Yap Score</TableHead>
                    <TableHead className="text-right w-[100px]">24h</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((entry) => (
                    <TableRow key={entry.rank}>
                      <TableCell className="font-medium">
                        {entry.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={entry.avatar}
                              alt={entry.name}
                              data-ai-hint="person portrait"
                            />
                            <AvatarFallback>
                              {entry.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.handle}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.yapScore.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'flex items-center justify-end gap-1 text-right font-medium',
                          entry.change > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        )}
                      >
                        {entry.change > 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(entry.change)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Trending Projects and a featured tool */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp />
                Trending Projects
              </CardTitle>
              <CardDescription>
                Hottest topics on the timeline right now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingProjects.map((project) => (
                <div key={project.name} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between bg-accent/50 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              {features[0].icon}
              <CardTitle>{features[0].title}</CardTitle>
              <CardDescription>{features[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={features[0].href}>
                  Go to {features[0].title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Your Toolkit</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.slice(1).map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
            >
              <CardHeader>
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="group">
                  <Link href={feature.href}>
                    Go to {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

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
import { ArrowRight, BarChart, BotMessageSquare, Users } from 'lucide-react';

const features = [
  {
    title: 'Yap Optimizer',
    description: 'Analyze your X/Twitter drafts to predict Yap scores and optimize for engagement within the Kaito community.',
    href: '/dashboard/yap-optimizer',
    icon: <BotMessageSquare className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'Leaderboard Tracker',
    description: 'Monitor the Kaito community leaderboard, track your rank, and get alerts on trending projects.',
    href: '/dashboard/leaderboard',
    icon: <BarChart className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'Smart Follower Matcher',
    description: 'Find high-value followers from any X handle and generate personalized DM templates to connect.',
    href: '/dashboard/follower-matcher',
    icon: <Users className="mb-4 h-10 w-10 text-accent" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to YapVault"
        description="Your all-in-one toolkit for navigating the Web3 social landscape."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
          >
            <CardHeader>
              {feature.icon}
              <CardTitle className="font-headline">{feature.title}</CardTitle>
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
  );
}

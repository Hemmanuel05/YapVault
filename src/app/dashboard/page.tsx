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
import { ArrowRight, BotMessageSquare, MessageSquareQuote, Sparkles, Lightbulb, MessageCircleQuestion } from 'lucide-react';

const features = [
  {
    title: 'Yap Optimizer',
    description: 'Analyze your X/Twitter drafts to predict Yap scores and optimize for engagement within the Kaito community.',
    href: '/dashboard/yap-optimizer',
    icon: <BotMessageSquare className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'InfoFi Content',
    description: 'Generate high-quality, technical crypto/AI analysis posts that earn Yap points with well-researched insights.',
    href: '/dashboard/infofi-content',
    icon: <Sparkles className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'Thread Generator',
    description: 'Craft compelling X threads from a single topic, optimized for engagement and readability.',
    href: '/dashboard/thread-generator',
    icon: <MessageSquareQuote className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'Content Ideas',
    description: "Overcome writer's block by generating creative post ideas and hooks from a single topic.",
    href: '/dashboard/content-ideas',
    icon: <Lightbulb className="mb-4 h-10 w-10 text-accent" />,
  },
  {
    title: 'Authentic Reply Generator',
    description: 'Craft replies that sound like a curious learner to build real connections and spark genuine conversation.',
    href: '/dashboard/reply-generator',
    icon: <MessageCircleQuestion className="mb-4 h-10 w-10 text-accent" />,
  }
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

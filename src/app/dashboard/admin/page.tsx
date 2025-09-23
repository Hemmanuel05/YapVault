import { PageHeader } from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BotMessageSquare,
  MessageSquareQuote,
  Sparkles,
  Lightbulb,
  MessageCircleQuestion,
  SearchCheck,
  User,
} from 'lucide-react';

const activityLog = [
  {
    user: {
      name: 'Ike Zahuemma',
      handle: '@heisninja',
      avatarId: 'avatar1',
    },
    action: 'Generated Persona',
    feature: 'Yap Optimizer',
    timestamp: '2024-09-25T10:30:00Z',
    details: 'Generated a new custom persona from 4 posts.',
    icon: <User />,
  },
  {
    user: {
      name: 'Wals.eth',
      handle: '@wals_eth',
      avatarId: 'avatar2',
    },
    action: 'Analyzed Post',
    feature: 'Post-Mortem Analyzer',
    timestamp: '2024-09-25T10:28:00Z',
    details: 'Analyzed a post about crypto CPMs.',
    icon: <SearchCheck />,
  },
  {
    user: {
      name: 'Ike Zahuemma',
      handle: '@heisninja',
      avatarId: 'avatar1',
    },
    action: 'Generated Reply',
    feature: 'Authentic Reply',
    timestamp: '2024-09-25T10:25:00Z',
    details: 'Replied to a post about Anichess.',
    icon: <MessageCircleQuestion />,
  },
  {
    user: {
      name: 'CryptoGamer',
      handle: '@gamer123',
      avatarId: 'avatar3',
    },
    action: 'Generated Thread',
    feature: 'Thread Generator',
    timestamp: '2024-09-25T10:15:00Z',
    details: 'Generated a 5-post thread on "Play-to-Earn economies".',
    icon: <MessageSquareQuote />,
  },
  {
    user: {
      name: 'DeFi Degen',
      handle: '@degen_dave',
      avatarId: 'avatar4',
    },
    action: 'Generated Ideas',
    feature: 'Content Ideas',
    timestamp: '2024-09-25T10:05:00Z',
    details: 'Brainstormed ideas for the topic "liquid restaking".',
    icon: <Lightbulb />,
  },
  {
    user: {
      name: 'Wals.eth',
      handle: '@wals_eth',
      avatarId: 'avatar2',
    },
    action: 'Generated InfoFi Post',
    feature: 'InfoFi Content',
    timestamp: '2024-09-25-T09:50:00Z',
    details: 'Generated content about $PUMP token analysis.',
    icon: <Sparkles />,
  },
  {
    user: {
      name: 'NFT Nick',
      handle: '@nick_nfts',
      avatarId: 'avatar5',
    },
action: 'Analyzed Draft',
    feature: 'Yap Optimizer',
    timestamp: '2024-09-25T09:45:00Z',
    details: 'Predicted Yap score for a draft about a new NFT drop.',
    icon: <BotMessageSquare />,
  },
];

const featureMap: { [key: string]: { icon: React.ReactNode, color: string } } = {
    "Yap Optimizer": { icon: <BotMessageSquare className="h-4 w-4" />, color: 'bg-blue-500/20 text-blue-400' },
    "InfoFi Content": { icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-500/20 text-purple-400' },
    "Thread Generator": { icon: <MessageSquareQuote className="h-4 w-4" />, color: 'bg-green-500/20 text-green-400' },
    "Content Ideas": { icon: <Lightbulb className="h-4 w-4" />, color: 'bg-yellow-500/20 text-yellow-400' },
    "Authentic Reply": { icon: <MessageCircleQuestion className="h-4 w-4" />, color: 'bg-cyan-500/20 text-cyan-400' },
    "Post-Mortem Analyzer": { icon: <SearchCheck className="h-4 w-4" />, color: 'bg-orange-500/20 text-orange-400' },
};


export default function AdminPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor user activity across the platform."
      />
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>
            A log of the most recent actions taken by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.map((log, index) => {
                const userAvatar = PlaceHolderImages.find(
                  (img) => img.id === log.user.avatarId
                );
                const featureInfo = featureMap[log.feature];

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar?.imageUrl} />
                          <AvatarFallback>
                            {log.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{log.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user.handle}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={`gap-2 ${featureInfo?.color}`}>
                            {featureInfo?.icon}
                            {log.feature}
                        </Badge>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useActivityLog } from '@/hooks/use-activity-log';
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
  ShieldQuestion,
} from 'lucide-react';
import { ActivityLogEntry } from '@/hooks/use-activity-log';

const featureMap: {
  [key: string]: { icon: React.ReactNode; color: string };
} = {
  'Yap Optimizer': {
    icon: <BotMessageSquare className="h-4 w-4" />,
    color: 'bg-blue-500/20 text-blue-400',
  },
  'InfoFi Content': {
    icon: <Sparkles className="h-4 w-4" />,
    color: 'bg-purple-500/20 text-purple-400',
  },
  'Thread Generator': {
    icon: <MessageSquareQuote className="h-4 w-4" />,
    color: 'bg-green-500/20 text-green-400',
  },
  'Content Ideas': {
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  'Authentic Reply': {
    icon: <MessageCircleQuestion className="h-4 w-4" />,
    color: 'bg-cyan-500/20 text-cyan-400',
  },
  'Post-Mortem Analyzer': {
    icon: <SearchCheck className="h-4 w-4" />,
    color: 'bg-orange-500/20 text-orange-400',
  },
  'Persona Generator': {
    icon: <ShieldQuestion className="h-4 w-4" />,
    color: 'bg-pink-500/20 text-pink-400',
  }
};

export default function AdminPage() {
  const { activityLog } = useActivityLog();
  const sortedLog = [...activityLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor user activity across the platform. (Logs are reset on page refresh)"
      />
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>
            A log of the most recent actions taken by users in this session.
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
              {sortedLog.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No activity recorded yet. Go use a feature!
                    </TableCell>
                 </TableRow>
              ) : (
                sortedLog.map((log: ActivityLogEntry, index: number) => {
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
                        {featureInfo ? (
                           <Badge
                            variant="outline"
                            className={`gap-2 ${featureInfo.color}`}
                          >
                            {featureInfo.icon}
                            {log.feature}
                          </Badge>
                        ) : (
                            <Badge variant="secondary">{log.feature}</Badge>
                        )}
                       
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

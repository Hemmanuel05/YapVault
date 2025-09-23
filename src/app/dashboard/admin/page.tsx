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
  ShieldAlert,
} from 'lucide-react';
import { ActivityLogEntry } from '@/hooks/use-activity-log';
import { useAuth } from '@/hooks/use-auth';

// In a production app, this would be stored in a secure database
// and not hardcoded.
const ADMIN_USERS = ['ikezahuemma@gmail.com']; 

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

function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
}

export default function AdminPage() {
  const { activityLog } = useActivityLog();
  const { user, isLoading } = useAuth();
  
  const isAuthorized = user && ADMIN_USERS.includes(user.email || '');

  if (isLoading) {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="Monitor user activity across the platform in real-time."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Real-Time User Activity</CardTitle>
                    <CardDescription>
                       Loading and verifying permissions...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!isAuthorized) {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Admin Dashboard"
                description="Monitor user activity across the platform in real-time."
            />
            <AccessDenied />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor user activity across the platform in real-time."
      />
      <Card>
        <CardHeader>
          <CardTitle>Real-Time User Activity</CardTitle>
          <CardDescription>
            A live log of all actions taken by users across the application, stored in Firestore.
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
              {activityLog.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No activity recorded yet. Go use a feature!
                    </TableCell>
                 </TableRow>
              ) : (
                activityLog.map((log: ActivityLogEntry) => {
                  const userAvatar = PlaceHolderImages.find(
                    (img) => img.id === log.user.avatarId
                  );
                  const featureInfo = featureMap[log.feature];

                  return (
                    <TableRow key={log.id}>
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
                              {log.user.email}
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
                        {log.timestamp.toDate().toLocaleString()}
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

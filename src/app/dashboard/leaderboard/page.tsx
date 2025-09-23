import { PageHeader } from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { leaderboardData, trendingProjects } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Leaderboard Tracker"
        description="Monitor user rankings and stay updated on trending projects in the Kaito ecosystem."
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Yap Score</TableHead>
                  <TableHead className="text-right w-[100px]">24h</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell className="font-medium">{user.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.handle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.yapScore.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'flex items-center justify-end gap-1 text-right',
                        user.change > 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {user.change > 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {Math.abs(user.change)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">Trending Projects</h2>
            {trendingProjects.map((project) => (
            <Alert key={project.name} className="bg-card">
                <Info className="h-4 w-4 text-accent" />
                <AlertTitle>{project.name}</AlertTitle>
                <AlertDescription>{project.description}</AlertDescription>
            </Alert>
            ))}
        </div>
      </div>
    </div>
  );
}

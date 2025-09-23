import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { SidebarNav } from './sidebar-nav';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Home } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ActivityLogProvider } from '@/hooks/use-activity-log';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'avatar1');
  
  return (
    <ActivityLogProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Logo className="h-6 w-6" />
              <span className="group-data-[collapsible=icon]:hidden">YapVault</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-full justify-start gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>IZ</AvatarFallback>
                  </Avatar>
                  <div className="text-left group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium">Ike Zahuemma</p>
                      <p className="text-xs text-muted-foreground">@heisninja</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/login">
                  <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ActivityLogProvider>
  );
}

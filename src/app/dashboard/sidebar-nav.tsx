"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, Sparkles, MessageSquareQuote, Lightbulb, MessageCircleQuestion, Home, SearchCheck, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home />,
    exact: true,
  },
  {
    href: '/dashboard/yap-optimizer',
    label: 'Yap Optimizer',
    icon: <BotMessageSquare />,
  },
  {
    href: '/dashboard/infofi-content',
    label: 'InfoFi Content',
    icon: <Sparkles />,
  },
  {
    href: '/dashboard/thread-generator',
    label: 'Thread Generator',
    icon: <MessageSquareQuote />,
  },
  {
    href: '/dashboard/content-ideas',
    label: 'Content Ideas',
    icon: <Lightbulb />,
  },
  {
    href: '/dashboard/reply-generator',
    label: 'Authentic Reply',
    icon: <MessageCircleQuestion />,
  },
  {
    href: '/dashboard/post-mortem-analyzer',
    label: 'Post-Mortem',
    icon: <SearchCheck />,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: <User />,
  }
];

const adminNavItems = [
    {
        href: '/dashboard/admin',
        label: 'Admin',
        icon: <Shield />,
        // In a production app, this would be stored in a secure database
        // and not hardcoded.
        adminEmails: ['ikezahuemma@gmail.com'],
    }
]

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
              tooltip={{ children: item.label, className: 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      <Separator className="my-2" />
      {adminNavItems.map((item) => {
        const isAuthorized = user && item.adminEmails.includes(user.email || '');
        if (!isAuthorized) return null;
        
        return (
            <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
                <SidebarMenuButton
                isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                tooltip={{ children: item.label, className: 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border' }}
                >
                {item.icon}
                <span>{item.label}</span>
                </SidebarMenuButton>
            </Link>
            </SidebarMenuItem>
        );
       })}
    </SidebarMenu>
  );
}

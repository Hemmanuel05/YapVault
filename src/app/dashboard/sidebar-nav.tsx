'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, BarChart, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/dashboard/yap-optimizer',
    label: 'Yap Optimizer',
    icon: <BotMessageSquare />,
  },
  {
    href: '/dashboard/leaderboard',
    label: 'Leaderboard',
    icon: <BarChart />,
  },
  {
    href: '/dashboard/follower-matcher',
    label: 'Follower Matcher',
    icon: <Users />,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.label, className: 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

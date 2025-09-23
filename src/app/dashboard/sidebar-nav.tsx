'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, Sparkles, MessageSquareQuote, Lightbulb, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
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
  }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
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

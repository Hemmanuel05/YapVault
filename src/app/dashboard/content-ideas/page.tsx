
'use client';
import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ContentIdeasClient = dynamic(() => import('./content-ideas-client').then(mod => mod.ContentIdeasClient), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function ContentIdeasPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Content Idea Generator"
        description="Overcome writer's block by generating creative post ideas and hooks from a single topic."
      />
      <ContentIdeasClient />
    </div>
  );
}

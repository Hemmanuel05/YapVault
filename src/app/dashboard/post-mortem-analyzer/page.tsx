
import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PostMortemClient = dynamic(() => import('@/app/dashboard/post-mortem-analyzer/post-mortem-client'), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
  ssr: false,
});


export default function PostMortemAnalyzerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Post-Mortem Analyzer"
        description="Learn from your past content by analyzing its strengths, weaknesses, and missed opportunities."
      />
      <PostMortemClient />
    </div>
  );
}


import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ThreadGeneratorClient = dynamic(() => import('@/app/dashboard/thread-generator/thread-generator-client'), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
  ssr: false,
});

export default function ThreadGeneratorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Thread Generator"
        description="Craft compelling X threads from a single topic, optimized for engagement."
      />
      <ThreadGeneratorClient />
    </div>
  );
}

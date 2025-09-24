
import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ReplyGeneratorClient = dynamic(() => import('@/app/dashboard/reply-generator/reply-generator-client'), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
  ssr: false,
});

export default function ReplyGeneratorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Authentic Reply Generator"
        description="Craft replies that sound like a curious learner to build real connections and spark genuine conversation."
      />
      <ReplyGeneratorClient />
    </div>
  );
}

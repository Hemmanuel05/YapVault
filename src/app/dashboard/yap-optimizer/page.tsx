
import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const YapOptimizerClient = dynamic(() => import('./yap-optimizer-client').then(mod => mod.YapOptimizerClient), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});


export default function YapOptimizerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Yap Optimizer"
        description="Craft the perfect X post. Our AI analyzes your draft for sentiment and keywords to predict its Yap Score."
      />
      <YapOptimizerClient />
    </div>
  );
}

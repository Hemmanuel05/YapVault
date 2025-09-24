
import { PageHeader } from '@/components/page-header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const InfoFiContentClient = dynamic(() => import('./infofi-content-client').then(mod => mod.InfoFiContentClient), {
  loading: () => <Skeleton className="h-[600px] w-full" />,
});

export default function InfoFiContentPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="InfoFi Smart Content Generator"
        description="Generate high-quality, technical crypto/AI analysis posts optimized for Yap points."
      />
      <InfoFiContentClient />
    </div>
  );
}

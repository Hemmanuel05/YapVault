import { PageHeader } from '@/components/page-header';
import { InfoFiContentClient } from './infofi-content-client';

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

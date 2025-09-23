import { PageHeader } from '@/components/page-header';
import { ThreadGeneratorClient } from './thread-generator-client';

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

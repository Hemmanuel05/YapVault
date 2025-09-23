import { PageHeader } from '@/components/page-header';
import { ReplyGeneratorClient } from './reply-generator-client';

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

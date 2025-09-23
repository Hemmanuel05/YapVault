import { PageHeader } from '@/components/page-header';
import { ContentIdeasClient } from './content-ideas-client';

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

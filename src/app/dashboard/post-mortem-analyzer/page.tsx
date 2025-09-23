import { PageHeader } from '@/components/page-header';
import { PostMortemClient } from './post-mortem-client';

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

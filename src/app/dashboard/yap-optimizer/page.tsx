import { PageHeader } from '@/components/page-header';
import { YapOptimizerClient } from './yap-optimizer-client';

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

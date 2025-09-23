import { config } from 'dotenv';
config();

import '@/ai/flows/yap-score-from-draft.ts';
import '@/ai/flows/generate-improved-draft.ts';
import '@/ai/flows/generate-infofi-post.ts';
import '@/ai/flows/generate-thread.ts';

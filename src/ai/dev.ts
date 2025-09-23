import { config } from 'dotenv';
config();

import '@/ai/flows/generate-draft-suggestions.ts';
import '@/ai/flows/yap-score-from-draft.ts';
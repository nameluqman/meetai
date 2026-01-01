import { agentsRouter } from '@/modules/agents/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';

import { createTRPCRouter } from '../types';

export const appRouter = createTRPCRouter({
      agents : agentsRouter,
      meetings : meetingsRouter,
      premium : premiumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
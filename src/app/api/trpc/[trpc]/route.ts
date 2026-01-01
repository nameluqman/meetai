export const runtime = 'nodejs'; // Ensure this is not 'edge'
export const dynamic = 'force-dynamic';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/types';
import { appRouter } from '@/trpc/routers/_app';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
  });
};

export { handler as GET, handler as POST };
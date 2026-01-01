import { createTRPCRouter, baseProcedure } from '../init';
import { z } from 'zod';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.string())
    .query(({ input }) => `Hello ${input}!`),
});

// export type definition of API
export type AppRouter = typeof appRouter;
import z from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";

import { createTRPCRouter , protectedProcedure} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import { Input } from "@/components/ui/input";

export const agentsRouter = createTRPCRouter({

    //todo change "getOne" to "protectedProcedure"
    getOne : protectedProcedure.input(z.object({id : z.string()})).query(async({input})=>{
        const [existingAgent] = await db
        .select({
            meetingCount:sql<number>`5`,
            ...getTableColumns(agents),
    })
        .from(agents)
        .where(eq(agents.id,input.id))
        
        await new Promise ((resolve) => setTimeout(resolve,1000));
        // throw new TRPCError({ code : "BAD_REQUEST"});
        
        return existingAgent;
    }),
    //todo change "getmany" to "protectedProcedure"
    getmany : protectedProcedure.query(async()=>{
        const data = await db
        .select()
        .from(agents)

        await new Promise ((resolve) => setTimeout(resolve,1000));
        // throw new TRPCError({ code : "BAD_REQUEST"});

        return data;
    }),
    create:protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async({input,ctx})=>{
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId:ctx.auth.user.id,
        })
        .returning();

        return createdAgent;
    })
});
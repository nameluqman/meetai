import {z} from "zod";
import JSONL from "jsonl-parse-stringify";
import { count, desc, and, eq, getTableColumns, ilike,sql, inArray} from "drizzle-orm";
import { db } from "@/db";
import { meetings , agents, user, meetingParticipants } from "@/db/schema";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stream-video";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/types";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { MeetingStatus, StreamTranscriptItem } from '../types';
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { streamChat } from "@/lib/stream-chat";

export const meetingsRouter = createTRPCRouter({

    generateChatToken:protectedProcedure.mutation(async({ ctx })=>{
        const token = streamChat.createToken(ctx.auth.user.id);
        await streamChat.upsertUser({
            id : ctx.auth.user.id,
            role: "admin",
        });
        return token;
    }),

    getTranscript : protectedProcedure
        .input(z.object({id: z.string()}))
        .query(async({input,ctx})=>{
        const existingMeeting = await db
        .select({
            meetings: getTableColumns(meetings),
            meetingParticipants: getTableColumns(meetingParticipants),
        })
        .from(meetings)
        .leftJoin(meetingParticipants, eq(meetingParticipants.meetingId, meetings.id))
        .where(
            and(
                eq(meetings.id , input.id),
                sql`(${meetings.userId} = ${ctx.auth.user.id} OR ${meetingParticipants.userId} = ${ctx.auth.user.id})`
            )
        );

        if(!existingMeeting || existingMeeting.length === 0){
            throw new TRPCError({
                code : "NOT_FOUND", 
                message : "Meeting not found"
            });
            }  

        if(!existingMeeting[0].meetings.transcriptUrl){
            return[];
        }
        const transcript = await fetch(existingMeeting[0].meetings.transcriptUrl)
        .then((res)=>res.text())
        .then((text)=>JSONL.parse<StreamTranscriptItem>(text))
        .catch(()=>{
            return[];
        })

        const speakerIds = [
            ...new Set(transcript.map((item)=>item.speaker_id)),
        ]; 

        const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id , speakerIds))
        .then((users)=>
            users.map((user)=>({
                ...user,
                image:
                    user.image ??
                    generateAvatarUri({ seed : user.name , variant: "initials" }),
            }))
        );
        const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id , speakerIds))
        .then((agents)=>
            agents.map((agent)=>({
                ...agent,
                image:
                    generateAvatarUri({ seed : agent.name , variant: "botttsNeutral" }),
            }))
        );

        const speakers =[...userSpeakers , ...agentSpeakers];

        const transcriptWithSpeakers = transcript.map((item)=>{
            const speaker = speakers.find(
                (speaker) => speaker.id === item.speaker_id
            );

            if(!speaker){
                return{
                    ...item,
                    user:{
                        name:"unknown",
                        image:generateAvatarUri({
                            seed : "unknown",
                            variant: "initials"
                        }),
                    },
                };
            }
            return{
                ...item,
                user:{
                    name: speaker.name,
                    image:speaker.image,
                },
            };
        })
        return transcriptWithSpeakers;
    }),

    generateToken : protectedProcedure.mutation(async ({ctx }) => {
        await streamVideo.upsertUsers([
            {
                id : ctx.auth.user.id,
                name : ctx.auth.user.name,
                role : "admin",
                image : 
                ctx.auth.user.image ??
                generateAvatarUri({seed : ctx.auth.user.name , variant : "initials" }),
            },
        ]);  
        const expirationTime = Math.floor(Date.now() / 1000) + 3600; 
        const issuedAt = Math.floor(Date.now() / 1000)  - 60; 

        const token = streamVideo.generateUserToken({
            user_id : ctx.auth.user.id,
            exp : expirationTime,
            validity_in_seconds : issuedAt,
        })
        return token;
    }),
    
    remove : protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ctx , input }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId , ctx.auth.user.id)
                    )
                )
                .returning(); 
                    
            if(!removedMeeting){
                throw new TRPCError({
                    code : "NOT_FOUND", 
                    message : "Meeting not found"
                });
            }  
            return removedMeeting; 
        }),
        
    update : protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ctx , input }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId,ctx.auth.user.id)
                    )
                )
                .returning(); 
                    
            if(!updatedMeeting){
                throw new TRPCError({
                    code : "NOT_FOUND", 
                    message : "Meeting not found"
                });
            }  
            return updatedMeeting; 
        }),

    create: premiumProcedure("meetings")
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            const call = streamVideo.video.call("default" , createdMeeting.id )
            await call.create({
                data : {
                    created_by_id : ctx.auth.user.id,
                    custom :{
                        meetingId : createdMeeting.id,
                        meetingName : createdMeeting.name,
                    },
                    settings_override : {
                        transcription : {
                            mode : "auto-on",
                            closed_caption_mode : "auto-on",
                        },
                        recording : {
                            mode : "auto-on",
                            quality : "1080p",
                        },
                    },
                }
            });

            await db
                .insert(meetingParticipants)
                .values({
                    meetingId: createdMeeting.id,
                    userId: ctx.auth.user.id,
                    role: "host"
                });

            if (createdMeeting.agentId) {
                const [existingAgent] = await db
                    .select()
                    .from(agents)
                    .where(eq(agents.id , createdMeeting.agentId!));

                if(!existingAgent){
                    throw new TRPCError({
                        code : "NOT_FOUND",
                        message : "Agent not found",
                    });    
                }
                
                await streamVideo.upsertUsers([
                    {
                        id : existingAgent.id,
                        name : existingAgent.name,
                        role : "user",
                        image : generateAvatarUri({
                            seed : existingAgent.name,
                            variant : "botttsNeutral",
                        }),
                    }
                ]);

                await db
                    .insert(meetingParticipants)
                    .values({
                        meetingId: createdMeeting.id,
                        agentId: existingAgent.id,
                        role: "agent"
                    });
            }
    
            return createdMeeting;
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input , ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent : agents,
                    host: user,
                    duration : sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .leftJoin(agents , eq(meetings.agentId , agents.id))
                .leftJoin(user, eq(meetings.userId, user.id))
                .where(eq(meetings.id, input.id))
                
            if(!existingMeeting){
                throw new TRPCError({code : "NOT_FOUND", message : "Meeting not found"});
            }    

            return existingMeeting;
        }),

    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z
                .number()
                .min(MIN_PAGE_SIZE)
                .max(MAX_PAGE_SIZE)
                .default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId : z.string().nullish(),
            status : z
                .enum([
                    MeetingStatus.Upcoming,
                    MeetingStatus.Active,
                    MeetingStatus.Completed,
                    MeetingStatus.Processing,
                    MeetingStatus.Cancelled,
                ])
                .nullish(),
        }))
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize ,status , agentId } = input;
            const data = await db
                .selectDistinct({
                    ...getTableColumns(meetings),
                    agent : agents,
                    host: user,
                    duration : sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents , eq(meetings.agentId , agents.id))
                .innerJoin(user, eq(meetings.userId, user.id))
                .leftJoin(meetingParticipants, eq(meetingParticipants.meetingId, meetings.id))
                .where(
                    and(
                        sql`(${meetings.userId} = ${ctx.auth.user.id} OR ${meetingParticipants.userId} = ${ctx.auth.user.id})`,
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status , status) : undefined,
                        agentId ? eq(meetings.agentId , agentId) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents , eq(meetings.agentId , agents.id))
                .innerJoin(user, eq(meetings.userId, user.id))
                .leftJoin(meetingParticipants, eq(meetingParticipants.meetingId, meetings.id))
                .where(
                    and(
                        sql`(${meetings.userId} = ${ctx.auth.user.id} OR ${meetingParticipants.userId} = ${ctx.auth.user.id})`,
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status , status) : undefined,
                        agentId ? eq(meetings.agentId , agentId) : undefined,
                    )
                );
            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
    
    joinMeeting: protectedProcedure
        .input(z.object({ meetingId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(eq(meetings.id, input.meetingId));

            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found"
                });
            }

            if (existingMeeting.status !== "active" && existingMeeting.status !== "upcoming") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Cannot join a meeting that is not active or upcoming"
                });
            }

            const [existingParticipant] = await db
                .select()
                .from(meetingParticipants)
                .where(
                    and(
                        eq(meetingParticipants.meetingId, input.meetingId),
                        eq(meetingParticipants.userId, ctx.auth.user.id),
                        sql`${meetingParticipants.leftAt} IS NULL`
                    )
                );

            if (existingParticipant) {
                return existingParticipant;
            }

            const [participant] = await db
                .insert(meetingParticipants)
                .values({
                    meetingId: input.meetingId,
                    userId: ctx.auth.user.id,
                    role: existingMeeting.userId === ctx.auth.user.id ? "host" : "participant"
                })
                .returning();

            return participant;
        }),

    leaveMeeting: protectedProcedure
        .input(z.object({ meetingId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [updatedParticipant] = await db
                .update(meetingParticipants)
                .set({ leftAt: new Date() })
                .where(
                    and(
                        eq(meetingParticipants.meetingId, input.meetingId),
                        eq(meetingParticipants.userId, ctx.auth.user.id),
                        sql`${meetingParticipants.leftAt} IS NULL`
                    )
                )
                .returning();

            if (!updatedParticipant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Participant not found or already left"
                });
            }

            return updatedParticipant;
        }),

    getMeetingParticipants: protectedProcedure
        .input(z.object({ meetingId: z.string() }))
        .query(async ({ input, ctx }) => {
            const participants = await db
                .select({
                    ...getTableColumns(meetingParticipants),
                    user: getTableColumns(user),
                    agent: getTableColumns(agents)
                })
                .from(meetingParticipants)
                .leftJoin(user, eq(meetingParticipants.userId, user.id))
                .leftJoin(agents, eq(meetingParticipants.agentId, agents.id))
                .where(
                    and(
                        eq(meetingParticipants.meetingId, input.meetingId),
                        sql`${meetingParticipants.leftAt} IS NULL`
                    )
                )
                .orderBy(meetingParticipants.joinedAt);

            return participants;
        }),
});
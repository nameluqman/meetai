import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify" ;

import { inngest } from "@/inngest/client";
import {createAgent ,openai ,TextMessage} from "@inngest/agent-kit";

import {StreamTranscriptItem} from "@/modules/meetings/types";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";

const summarizer = createAgent({
  name : "summarizer",
  system:`
  You are an expert meeting summarizer specializing in multi-participant conversations. You analyze transcripts with multiple speakers and create comprehensive, readable summaries.

  Your task is to:
  1. Identify all participants and their roles in the conversation
  2. Track the flow of discussion between different speakers
  3. Highlight key decisions, action items, and outcomes
  4. Note any conflicts, agreements, or important interactions
  5. Capture the overall dynamics and progression of the meeting

  Use the following markdown structure for every output:

  ### Meeting Overview
  Provide a comprehensive summary of the multi-participant meeting. Include:
  - Meeting purpose and context
  - All participants and their apparent roles
  - Overall tone and dynamics of the conversation
  - Key outcomes and decisions made

  ### Participant Contributions
  Break down each participant's key contributions and perspectives:

  #### [Speaker Name]
  - Main points and arguments presented
  - Questions asked or issues raised
  - Expertise or role demonstrated
  - Notable interactions with other participants

  ### Key Discussion Points
  Organize by major topics with timestamp ranges and speaker interactions:

  #### [Topic Name] ([Time Range])
  - **[Speaker Name]**: Point or contribution made
  - **[Speaker Name]**: Response or counterpoint
  - Group discussion: How the topic evolved through multiple perspectives
  - Resolution or outcome for this topic

  ### Action Items & Decisions
  List concrete decisions made and action items assigned:
  - **Decision**: [Description] - Made by [Speaker/Group consensus]
  - **Action Item**: [Task] - Assigned to [Speaker] - [Deadline if mentioned]

  ### Next Steps
  Outline follow-up items, future meetings, or pending discussions.

  Focus on capturing the richness of multi-person interactions, not just individual statements. Highlight collaboration, debate, and consensus-building processes.
  `.trim(),
  model: openai({model:"gpt-4o",apiKey :process.env.OPENAI_API_KEY}),
})

export const meetingsProcessing = inngest.createFunction(
  {id : "meetings/processing"},
  {event : "meetings/processing"},

  async ({event ,step}) =>{
    const response = await step.run("fetch-transcript" ,async ()=>{
      return fetch(event.data.transcriptUrl).then((res)=>res.text());      
    });

    const transcript = await step.run("parse-transcript" , async () =>{
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptwithSpeakers = await step.run("add-speakers" , async () =>{
          const speakerIds =[
            ...new Set(transcript.map((item)=>item.speaker_id)),
          ];

          const userSpeakers = await db
          .select()
          .from(user)
          .where(inArray(user.id , speakerIds))
          .then((users)=>
             users.map((users)=>({
            ...user,
          }))
        );
          const agentSpeakers = await db
          .select()
          .from(agents)
          .where(inArray(agents.id , speakerIds))
          .then((agents)=>
             agents.map((agent)=>({
            ...agent,
          }))
        );

        const speakers = [...userSpeakers , ...agentSpeakers]

        return transcript.map((item)=>{
          const speaker = speakers.find(
            (speaker) => speaker.id === item.speaker_id
          );
          if(!speaker){
            return{
              ...item,
              user:{
                name : "Unknown",
              },
            };
          }
          return{
              ...item,
              user:{
                name : speaker.name,
              },
            };
          
        });
      });

      const {output} = await summarizer.run(
        `Analyze this multi-participant meeting transcript with ${transcriptwithSpeakers.length} speakers. Focus on interactions, discussion flow, and collaborative dynamics. ` +
        JSON.stringify(transcriptwithSpeakers)
      );

      await step.run("save-summary" , async () =>{
        await db
          .update(meetings)
          .set({
            summary: (output[0] as TextMessage).content as string,
            status : "completed",
          })
          .where(eq(meetings.id , event.data.meetingId))
      })
  },
);
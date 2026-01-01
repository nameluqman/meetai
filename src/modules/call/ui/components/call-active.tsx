import Link from "next/link";
import Image from "next/image";

import {
    CallControls,
    PaginatedGridLayout,
} from "@stream-io/video-react-sdk"

import { MeetingParticipants } from "@/modules/meetings/ui/components/meeting-participants";
import { ShareMeetingLink } from "@/modules/meetings/ui/components/share-meeting-link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface Props{
    onLeave : () =>void;
    onParticipantLeave : () =>void;
    meetingName : string
    meetingId: string;
};

export const CallActive = ({onLeave, onParticipantLeave, meetingName, meetingId} : Props)=>{
    const trpc = useTRPC();
    const { data: user } = authClient.useSession();
    const { data: meeting } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    const isHost = user?.user?.id === meeting.host?.id;

    const { mutateAsync: leaveMeeting } = useMutation(
        trpc.meetings.leaveMeeting.mutationOptions()
    );

    const handleParticipantLeave = async () => {
        try {
            await leaveMeeting({ meetingId });
            onParticipantLeave();
        } catch (error) {
            console.error("Failed to leave meeting:", error);
        }
    };

    return(
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src="/logo.svg" width={22} height={22} alt="Logo"/>
                </Link>
                <h4 className="text-base">
                    {meetingName}
                </h4>
            </div>
            <div className="flex-1 flex gap-4">
                <div className="flex-1">
                    <PaginatedGridLayout />
                </div>
                <div className="w-80 space-y-4">
                    <ShareMeetingLink meetingId={meetingId} meetingName={meetingName} />
                    <MeetingParticipants meetingId={meetingId} />
                </div>
            </div>
            <div className="bg-[#101213] rounded-full px-4 flex items-center justify-between">
                <CallControls 
                    onLeave={isHost ? onLeave : undefined}
                />
                {!isHost && (
                    <button 
                        onClick={handleParticipantLeave}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors text-sm"
                    >
                        Leave Call
                    </button>
                )}
            </div>
        </div>
    )
}
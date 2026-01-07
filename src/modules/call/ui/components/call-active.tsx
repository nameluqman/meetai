import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
import { XIcon, UsersIcon, Share2Icon } from "lucide-react";

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
    const [showSidebar, setShowSidebar] = useState(false);

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

    const handleLeave = async () => {
        if (isHost) {
            // Host ends the meeting for everyone
            onLeave();
        } else {
            // Participant leaves the meeting (meeting continues)
            await handleParticipantLeave();
        }
    };

    return(
        <div className="flex flex-col justify-between h-full text-white relative">
            {/* Header */}
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4 z-10">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src="/logo.svg" width={22} height={22} alt="Logo"/>
                </Link>
                <h4 className="text-base truncate flex-1">
                    {meetingName}
                </h4>
                
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    {showSidebar ? <XIcon className="w-4 h-4" /> : <UsersIcon className="w-4 h-4" />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 relative">
                {/* Video Grid */}
                <div className="flex-1">
                    <PaginatedGridLayout />
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-80 space-y-4">
                    <ShareMeetingLink meetingId={meetingId} meetingName={meetingName} />
                    <MeetingParticipants meetingId={meetingId} />
                </div>

                {/* Mobile Sidebar Overlay */}
                {showSidebar && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="lg:hidden fixed inset-0 bg-black/50 z-20"
                            onClick={() => setShowSidebar(false)}
                        />
                        
                        {/* Sliding Sidebar */}
                        <div className="lg:hidden fixed right-0 top-0 h-full w-80 bg-[#101213] z-30 overflow-y-auto">
                            <div className="p-4">
                                {/* Mobile Sidebar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Meeting Details</h3>
                                    <button
                                        onClick={() => setShowSidebar(false)}
                                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Sidebar Content */}
                                <div className="space-y-4">
                                    <ShareMeetingLink meetingId={meetingId} meetingName={meetingName} />
                                    <MeetingParticipants meetingId={meetingId} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="bg-[#101213] rounded-full px-4 flex items-center justify-between z-10">
                <CallControls 
                    onLeave={handleLeave}
                />
            </div>
        </div>
    )
}
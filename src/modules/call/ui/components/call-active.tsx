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
        <div className="flex flex-col justify-between h-full text-white relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="glass-morphism rounded-full p-4 flex items-center gap-4 z-10 m-2 sm:m-4">
                <Link href="/" className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full w-fit transition-all duration-300 transform hover:scale-110">
                    <Image src="/logo.svg" width={24} height={24} alt="Logo"/>
                </Link>
                <h4 className="text-base sm:text-lg truncate flex-1 font-medium">
                    {meetingName}
                </h4>
                
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                    {showSidebar ? <XIcon className="w-4 h-4" /> : <UsersIcon className="w-4 h-4" />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 relative p-2 sm:p-4">
                {/* Video Grid */}
                <div className="flex-1 min-h-0 order-1 lg:order-1">
                    <PaginatedGridLayout />
                </div>

                {/* Desktop Sidebar - Hidden on mobile, visible on tablet and up */}
                <div className="hidden md:block w-64 lg:w-80 space-y-4 order-2 lg:order-2">
                    <div className="glass-morphism rounded-2xl p-4">
                        <ShareMeetingLink meetingId={meetingId} meetingName={meetingName} />
                    </div>
                    <div className="glass-morphism rounded-2xl p-4">
                        <MeetingParticipants meetingId={meetingId} />
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {showSidebar && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="md:hidden fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
                            onClick={() => setShowSidebar(false)}
                        />
                        
                        {/* Sliding Sidebar */}
                        <div className="md:hidden fixed right-0 top-0 h-full w-72 sm:w-80 bg-gray-900/95 backdrop-blur-lg z-30 overflow-y-auto border-l border-white/10">
                            <div className="p-4 space-y-4">
                                {/* Mobile Sidebar Header */}
                                <div className="flex items-center justify-between p-4 border-b border-white/10">
                                    <h3 className="text-lg font-semibold">Meeting Details</h3>
                                    <button
                                        onClick={() => setShowSidebar(false)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Sidebar Content */}
                                <div className="space-y-4 p-4">
                                    <div className="glass-morphism rounded-2xl p-4">
                                        <ShareMeetingLink meetingId={meetingId} meetingName={meetingName} />
                                    </div>
                                    <div className="glass-morphism rounded-2xl p-4">
                                        <MeetingParticipants meetingId={meetingId} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="glass-morphism rounded-full px-4 sm:px-6 flex items-center justify-between z-10 m-2 sm:m-4">
                <CallControls 
                    onLeave={handleLeave}
                />
            </div>
        </div>
    )
}
import { useState, useEffect } from "react";
import { 
    StreamTheme,
    useCall,
    CallingState,
} from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { MeetingStatus } from "@/modules/meetings/types";

interface Props {
    meetingName: string;
    meetingId: string;
}

export const CallUI = ({ meetingName, meetingId }: Props) => {
    
    const { data: user } = authClient.useSession();
    const trpc = useTRPC();
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
    const { data: meeting } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    const { mutateAsync: joinMeeting } = useMutation(
        trpc.meetings.joinMeeting.mutationOptions()
    );

    // Check if user is already in the meeting when component loads
    useEffect(() => {
        if (!call || !meeting) return;

        // If meeting is active and user is already in the call, show call view
        if (meeting.status === MeetingStatus.Active && call.state.callingState === CallingState.JOINED) {
            console.log("User is already in active meeting, showing call view");
            setShow("call");
        }
        // If meeting is active but user is not in call, they might need to rejoin
        else if (meeting.status === MeetingStatus.Active && call.state.callingState === CallingState.LEFT) {
            console.log("Meeting is active but user left, showing lobby to rejoin");
            setShow("lobby");
        }
        // If meeting is not active, show lobby
        else {
            console.log("Meeting not active, showing lobby");
            setShow("lobby");
        }
    }, [call, meeting]);

    const handleJoin = async () => {
        if (!call) return;

        try {
            console.log("Joining meeting:", meetingId);
            const participant = await joinMeeting({ meetingId });
            console.log("Joined as participant:", participant);
            await call.join();
            setShow("call");
        } catch (error: unknown) {
            console.error("Failed to join meeting:", error);

            // NARROW THE TYPE TO ACCESS .message
            let message = "An unknown error occurred";
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "string") {
                message = error;
            }

            alert(`Failed to join meeting: ${message}`);
        }
    }

    const handleLeave = async () => {
        if (!call) return;
        
        await call.endCall(); // Ends meeting for everyone (called only by host)
        setShow("ended");
    }

    const handleParticipantLeave = async () => {
        if (!call) return;
        await call.leave(); // Participant leaves, meeting continues
        // Redirect participant back to dashboard instead of showing ended screen
        window.location.href = "/";
    }

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && (
                <CallActive 
                    onLeave={handleLeave} 
                    onParticipantLeave={handleParticipantLeave}
                    meetingName={meetingName} 
                    meetingId={meetingId} 
                />
            )}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    );
};
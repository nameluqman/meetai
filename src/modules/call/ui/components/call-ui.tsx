import { useState } from "react";
import { 
    StreamTheme,
    useCall,
} from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

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
        
        // Double-check: Only host should be able to end meeting
        const isHost = user?.user?.id === meeting.host?.id;
        if (!isHost) {
            console.error("Unauthorized: Only host can end meeting");
            return;
        }
        
        await call.endCall(); // Only host can call this, ends meeting for everyone
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
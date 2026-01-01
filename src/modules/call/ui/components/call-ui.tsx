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

interface Props {
    meetingName: string;
    meetingId: string;
}

export const CallUI = ({ meetingName, meetingId }: Props) => {
    
    const trpc = useTRPC();
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

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
        await call.endCall(); // Only host can call this, ends meeting for everyone
        setShow("ended");
    }

    const handleParticipantLeave = async () => {
        if (!call) return;
        await call.leave(); // Participant leaves, meeting continues
        setShow("ended");
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
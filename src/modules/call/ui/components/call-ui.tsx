import { useState } from "react";
import { 
    StreamTheme,
    useCall,
} from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
    meetingName :string;
}



export const CallUI =({meetingName} : Props)=>{
    
    const call = useCall();
    const [show ,setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () =>{
        if(!call) return;

         await call.join();

         setShow("call");
    }
    const handleLeave = async () =>{
        if(!call) return;

         call.endCall();

         setShow("ended");
    }

    return(
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName}/>}
            {show === "ended" && <CallEnded />}

        </StreamTheme>
    )


}
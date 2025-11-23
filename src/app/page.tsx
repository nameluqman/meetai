"use client";
import { useState } from "react";

import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";


export default function Home() {
const {data: session} = authClient.useSession() 


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      name,
      email,
      password
    },
      {
        onError: () => {
          window.alert("Error: Something went wrong");
      },
      
        onSuccess: () => {
          window.alert("Success: Account created");
        }
      
    });
  }
  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    },
      {
        onError: () => {
          window.alert("Error: Something went wrong");
      },
      
        onSuccess: () => {
          window.alert("Success: Account created");
        }
      
    });
  }
if (session){
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <p>Welcome, {session.user.name}</p>

      <Button onClick={()=>authClient.signOut()}>
        Sign Out
      </Button>
    </div>
    
  )
  };


  return (
    <div className="p-4 flex flex-col gap-y-p">
    <div className="p-4 flex flex-col gap-y-4">
   <Input 
   placeholder="name" 
   value={name} 
   onChange={(e)=>setName(e.target.value)}
   />

   <Input 
   placeholder="email" 
   value={email} 
   onChange={(e)=>setEmail(e.target.value)}
   />

   <Input 
   placeholder="password" 
   type="password" 
   value={password} 
   onChange={(e)=>setPassword(e.target.value)}
   />
   <Button onClick={onSubmit}>
    Create Account
   </Button>
</div>  

    <div className="p-4 flex flex-col gap-y-4">

   <Input 
   placeholder="email" 
   value={email} 
   onChange={(e)=>setEmail(e.target.value)}
   />

   <Input 
   placeholder="password" 
   type="password" 
   value={password} 
   onChange={(e)=>setPassword(e.target.value)}
   />
   <Button onClick={onLogin}>
        Login in
   </Button>
</div>  
</div>
  );
}

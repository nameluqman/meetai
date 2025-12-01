"use client"

import { useSuspenseQuery} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

export const AgentsView = () =>{
    const trpc = useTRPC();
    const {data } = useSuspenseQuery(trpc.agents.getmany.queryOptions());
    
    return (
        <div>
               {JSON.stringify(data , null ,2)}
        </div>
        );
    };
    export const AgentsViewLoading = () =>{
        return (
            <LoadingState 
                title="Loading Agents"
                description="This may take few Seconds"
            />
        );
    };
    export const AgentsViewError = () =>{
        return (
            <ErrorState 
            title="Error Loading Agents"
            description="Something went Wrong"
        />
        );
    };
    
    
    
    
    
    
    
    
    
    
    // const {data , isLoading , isError} = useSuspenseQuery(trpc.agents.getmany.queryOptions());
    // if(isLoading){
    //     return(
    //         <LoadingState 
    //         title ="Loading Agents"
    //         description="This may take a few seconds"
    //         />
    //     );
    // };
    // if(isError){
    //     return(
    //         <ErrorState 
    //         title ="Error Loading Agents"
    //         description="Please try again later"
    //         />
    //     );
    // };
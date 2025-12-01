"use client"

import { useSuspenseQuery} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";

export const AgentsView = () =>{
    const trpc = useTRPC();
    const {data } = useSuspenseQuery(trpc.agents.getmany.queryOptions());
    
    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
               <DataTable data={data} columns={columns} />
               {data.length === 0 &&(
                <EmptyState 
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions amd interact with participant during the call."
                />
               )}
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
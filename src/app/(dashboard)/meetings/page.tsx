import { getQueryClient , trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { 
    MeetingsView, 
    MeetingsViewError, 
    MeetingsViewLoading 
} from "@/modules/meetings/ui/views/meetings-view";

const Page = () => {

    const queryClient = getQueryClient();
    queryClient.prefetchQuery(
        trpc.meetings.getmany.queryOptions({})
    );

  return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
  );
};
export default Page;

"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    VideoIcon, 
    UsersIcon, 
    ClockIcon, 
    TrendingUpIcon,
    CalendarIcon,
    MicIcon,
    BotIcon,
    PlayIcon,
    PlusIcon,
    ArrowRightIcon,
    ActivityIcon,
    BarChart3Icon
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingStatus } from "@/modules/meetings/types";

export const HomeView = () => {
    const trpc = useTRPC();
    const { data: user } = authClient.useSession();
    const [timeRange, setTimeRange] = useState("week");

    // Get recent meetings for display
    const { data: recentMeetings } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ 
            page: 1, 
            pageSize: 5,
            search: ""
        })
    );

    // Get total counts for each status
    const { data: totalMeetingsData } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ 
            page: 1, 
            pageSize: 1,
            search: ""
        })
    );
    const { data: activeMeetingsData } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ 
            page: 1, 
            pageSize: 1,
            status: MeetingStatus.Active
        })
    );
    const { data: completedMeetingsData } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ 
            page: 1, 
            pageSize: 1,
            status: MeetingStatus.Completed
        })
    );
    const { data: processingMeetingsData } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({ 
            page: 1, 
            pageSize: 1,
            status: MeetingStatus.Processing
        })
    );

    // Get agents
    const { data: agents } = useSuspenseQuery(
        trpc.agents.getMany.queryOptions({ 
            page: 1, 
            pageSize: 3 
        })
    );

    // Calculate stats from total counts
    const totalMeetings = totalMeetingsData?.total || 0;
    const activeMeetings = activeMeetingsData?.total || 0;
    const completedMeetings = completedMeetingsData?.total || 0;
    const processingMeetings = processingMeetingsData?.total || 0;
    const totalAgents = agents?.total || 0;

    const completionRate = totalMeetings > 0 ? (completedMeetings / totalMeetings) * 100 : 0;

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 border border-blue-200/50 dark:border-blue-800/30">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">
                        Welcome back, {user?.user?.name}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg sm:text-xl lg:text-2xl font-medium">
                        Here's what's happening with your meetings today
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    <Button asChild className="w-full sm:w-auto lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Link href="/meetings/new">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            New Meeting
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto lg:w-auto border-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 transition-all duration-300">
                        <Link href="/agents">
                            <BotIcon className="w-5 h-5 mr-2" />
                            Manage Agents
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <Link href="/meetings">
                    <Card className="relative overflow-hidden card-hover group cursor-pointer border-0 shadow-lg hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Meetings</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <VideoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 animate-pulse-slow">{totalMeetings}</div>
                            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                                All meetings
                            </p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
                    </Card>
                </Link>

                <Link href="/meetings?status=active">
                    <Card className="relative overflow-hidden card-hover group cursor-pointer border-0 shadow-lg hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Active Now</CardTitle>
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 animate-pulse">
                                <ActivityIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{activeMeetings}</div>
                            <p className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
                                Live meetings
                            </p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700"></div>
                    </Card>
                </Link>

                <Link href="/meetings?status=processing">
                    <Card className="relative overflow-hidden card-hover group cursor-pointer border-0 shadow-lg hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300">Processing</CardTitle>
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <ClockIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{processingMeetings}</div>
                            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                                Being processed
                            </p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"></div>
                    </Card>
                </Link>

                <Link href="/meetings?status=completed">
                    <Card className="relative overflow-hidden card-hover group cursor-pointer border-0 shadow-lg hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Completed</CardTitle>
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <TrendingUpIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{completedMeetings}</div>
                            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">
                                {completionRate.toFixed(1)}% completion
                            </p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"></div>
                    </Card>
                </Link>

                <Card className="relative overflow-hidden border-0 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <CardTitle className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Agents</CardTitle>
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 animate-float">
                            <BotIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{totalAgents}</div>
                        <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">
                            Ready to assist
                        </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700"></div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Meetings */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold">Recent Meetings</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/meetings">
                                View all
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>

                    {recentMeetings?.items?.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-16">
                                <VideoIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">No meetings yet</h3>
                                <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base">
                                    Start your first AI-powered meeting to see it here
                                </p>
                                <Button asChild>
                                    <Link href="/meetings/new">
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Meeting
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {recentMeetings?.items?.map((meeting) => (
                                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center space-x-3 sm:space-x-4">
                                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                                                    <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm sm:text-base">{meeting.name}</h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground gap-2 sm:gap-4">
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                            {meeting.startedAt ? new Date(meeting.startedAt).toLocaleDateString() : "Not started"}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                            {meeting.duration ? `${Math.round(meeting.duration / 60)} min` : "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3">
                                                <Badge className={
                                                    meeting.status === MeetingStatus.Active ? "bg-green-500/20 text-green-800 border-green-800/5" :
                                                    meeting.status === MeetingStatus.Completed ? "bg-gray-500/20 text-gray-800 border-gray-800/5" :
                                                    "bg-blue-500/20 text-blue-800 border-blue-800/5"
                                                }>
                                                    {meeting.status}
                                                </Badge>
                                                {meeting.status === MeetingStatus.Active ? (
                                                    <Button size="sm" asChild>
                                                        <Link href={`/call/${meeting.id}`}>
                                                            <PlayIcon className="w-4 h-4 mr-2" />
                                                            Join
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/meetings/${meeting.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {meeting.agent && (
                                            <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                                                <BotIcon className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs sm:text-sm text-muted-foreground">
                                                    AI Assistant: {meeting.agent.name}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" asChild>
                                <Link href="/meetings/new">
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Create New Meeting
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/agents">
                                    <BotIcon className="w-4 h-4 mr-2" />
                                    Browse AI Agents
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/meetings">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    View All Meetings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Available Agents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Available AI Agents</CardTitle>
                            <CardDescription>
                                Intelligent assistants for your meetings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {agents?.items?.map((agent) => (
                                <div key={agent.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <BotIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{agent.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {agent.instructions || "AI Assistant"}
                                        </p>
                                    </div>
                                    <Button size="sm" variant="ghost" asChild>
                                        <Link href={`/agents/${agent.id}`}>
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                            {agents?.items?.length === 0 && (
                                <div className="text-center py-4">
                                    <BotIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No agents available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activity Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Meeting Completion</span>
                                    <span>{completionRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={completionRate} className="h-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{activeMeetings}</div>
                                    <div className="text-xs text-muted-foreground">Live Now</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{totalAgents}</div>
                                    <div className="text-xs text-muted-foreground">AI Agents</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
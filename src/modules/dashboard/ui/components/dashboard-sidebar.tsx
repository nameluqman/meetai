"use client";
import Link from "next/link";
import Image from "next/image";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupTitle,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { DashboardTrial } from "./dashboard-trial";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon : BotIcon,
        label : "Agents",
        href : "/agents",
    }   
];
const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    return (
        <Sidebar className="border-r border-sidebar-border/50">
            <SidebarHeader className="text-sidebar-accent-foreground bg-gradient-to-r from-sidebar to-sidebar-accent/20">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 pt-3 pb-2 hover:bg-white/5 rounded-lg transition-all duration-300 group"
                >
                    <div className="relative">
                        <Image
                            src="/logo.svg"
                            height={40}
                            width={40}
                            alt="Meet.AI"
                            className="transform transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-accent-foreground bg-clip-text text-transparent">
                        Meet.AI
                    </p>
                </Link>
            </SidebarHeader>

            <SidebarContent className="p-3">
                <SidebarGroup>
                    <SidebarGroupTitle className="text-sidebar-foreground/70 font-semibold">
                        Main
                    </SidebarGroupTitle>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        size="lg"
                                        className={cn(
                                            "hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground transition-all duration-300 group",
                                            pathname === item.href &&
                                                "bg-sidebar-accent/30 text-sidebar-accent-foreground font-semibold"
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                            <span>{item.label}</span>
                                            {pathname === item.href && (
                                                <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupTitle className="text-sidebar-foreground/70 font-semibold">
                        Resources
                    </SidebarGroupTitle>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        size="lg"
                                        className={cn(
                                            "hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground transition-all duration-300 group",
                                            pathname === item.href &&
                                                "bg-sidebar-accent/30 text-sidebar-accent-foreground font-semibold"
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                            <span>{item.label}</span>
                                            {pathname === item.href && (
                                                <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3 border-t border-sidebar-border/50">
                <DashboardTrial />
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
};
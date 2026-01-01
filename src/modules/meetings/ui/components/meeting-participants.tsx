"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { UsersIcon, CrownIcon, BotIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  meetingId: string;
}

export const MeetingParticipants = ({ meetingId }: Props) => {
  const trpc = useTRPC();

  const { data: participants } = useSuspenseQuery(
    trpc.meetings.getMeetingParticipants.queryOptions({ meetingId })
  );

  const getParticipantIcon = (role: string) => {
    switch (role) {
      case "host":
        return <CrownIcon className="size-4 text-yellow-500" />;
      case "agent":
        return <BotIcon className="size-4 text-blue-500" />;
      default:
        return <UsersIcon className="size-4 text-gray-500" />;
    }
  };

  const getParticipantName = (participant: any) => {
    if (participant.user) {
      return participant.user.name;
    }
    if (participant.agent) {
      return participant.agent.name;
    }
    return "Unknown";
  };

  const getParticipantImage = (participant: any) => {
    if (participant.user) {
      return (
        participant.user.image ??
        generateAvatarUri({ seed: participant.user.name, variant: "initials" })
      );
    }
    if (participant.agent) {
      return generateAvatarUri({
        seed: participant.agent.name,
        variant: "botttsNeutral",
      });
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="size-5" />
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={getParticipantImage(participant) || undefined}
                    alt={getParticipantName(participant)}
                  />
                  <AvatarFallback>
                    {getParticipantName(participant).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getParticipantName(participant)}</p>
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getParticipantIcon(participant.role)}
                <Badge variant="secondary" className="capitalize">
                  {participant.role}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

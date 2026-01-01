"use client";

import { useState } from "react";
import { CopyIcon, Share2Icon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const ShareMeetingLink = ({ meetingId, meetingName }: Props) => {
  const [copied, setCopied] = useState(false);

  const meetingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/call/${meetingId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2Icon className="size-5" />
          Share Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Meeting Link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono truncate">
              {meetingLink}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <CheckIcon className="size-4 text-green-600" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">Share this link with other participants to join the meeting:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Anyone with the link can join this meeting</li>
            <li>Participants will be added to the meeting automatically</li>
            <li>The meeting supports multiple participants simultaneously</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";

const NewMeetingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Open dialog immediately when page loads
        setIsOpen(true);
    }, []);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Redirect back to meetings page when dialog is closed
            router.push("/meetings");
        }
    };

    return (
        <NewMeetingDialog 
            open={isOpen} 
            onOpenChange={handleOpenChange}
        />
    );
};

export default NewMeetingPage;

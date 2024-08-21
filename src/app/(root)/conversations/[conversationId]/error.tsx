"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";

export default function Error({error}: {error: Error}) {
    const router = useRouter();

    useEffect(() => {
        router.push("/conversations")
    }, [error, router]);

    return <ConversationFallback />    
}
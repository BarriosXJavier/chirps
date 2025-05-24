"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useConvo } from "../../../../../../../hooks/useConvo";

export const TypingIndicator = () => {
  const { convoId } = useConvo();
  const typingUsers = useQuery(
    api.typing?.get,
    convoId ? { conversationId: convoId } : "skip"
  );

  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 bottom-16 px-4 py-2 rounded-lg bg-secondary/90 shadow-md animate-fade-in">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-secondary-foreground">
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing`
            : `${typingUsers.length} people are typing`}
        </span>
        <span className="flex ml-1">
          <span
            className="h-1 w-1 bg-secondary-foreground rounded-full mr-1 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="h-1 w-1 bg-secondary-foreground rounded-full mr-1 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="h-1 w-1 bg-secondary-foreground rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </span>
      </div>
    </div>
  );
};

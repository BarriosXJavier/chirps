"use client";

import React from "react";
import { useConvo } from "../../../../../../../hooks/useConvo";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import Message from "./Message";

const Body = () => {
  const { convoId } = useConvo();

  const messages = useQuery(api.messages.get, {
    id: convoId as Id<"conversations">,
  });

  return (
    <div className="relative flex-1 w-full flex flex-col-reverse overflow-y-auto gap-1 p-4 no-scrollbar bg-background/30 rounded-lg shadow-inner">
      {!messages || messages.length === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground animate-fade-in">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/70"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p className="text-center font-medium">No messages yet</p>
          <p className="text-sm mt-1">Start the conversation below!</p>
        </div>
      ) : (
        messages
          .map(({ message, senderImage, senderName, isCurrentUser }, index) => {
            if (!message) {
              console.error("Message data missing at index", index);
              return null;
            }

            const lastByUser =
              index > 0 &&
              messages[index - 1]?.message?.senderId === message.senderId;

            return (
              <Message
                key={message._id}
                fromCurrentUser={isCurrentUser}
                senderImage={senderImage}
                senderName={senderName}
                lastByUser={lastByUser}
                content={message.content}
                createdAt={message._creationTime}
                type={message.type}
              />
            );
          })
          .filter(Boolean)
      )}

      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-background/40 to-transparent" />
      <div className="absolute right-4 bottom-4 z-10">
        <button
          className="p-2 bg-primary/90 text-primary-foreground rounded-full shadow-md opacity-0 hover:opacity-100 transition-opacity focus:opacity-100"
          onClick={() => {
            // Scroll to bottom functionality
            const container = document.querySelector(".no-scrollbar");
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Body;

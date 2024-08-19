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
    <div className="flex-1 w-full flex flex-col-reverse overflow-y-scroll gap-2 p-3 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, index) => {
          const lastByUser = 
            messages[index - 1]?.message.senderId ===
            messages[index].message.senderId;

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
        }
      )}
    </div>
  );
};

export default Body;

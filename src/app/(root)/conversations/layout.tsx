"use client";

import React from "react";
import ItemsList from "@/components/ui/shared/itemlist/itemlist";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import DMConversation from "./_components/DMConversation";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout: React.FC<Props> = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemsList title="Conversations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? null : (
                <DMConversation
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  lastMessageSender={conversations.lastMessage?.sender || ""}
                  lastMessageContent={conversations.lastMessage?.content || ""}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemsList>
      {children}
    </>
  );
};

export default ConversationsLayout;

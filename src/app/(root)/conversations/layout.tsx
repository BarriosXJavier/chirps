"use client";

import React from "react";
import ItemsList from "@/components/ui/shared/itemlist/ItemList";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import DMConversation from "./_components/DMConversation";
import CreateGroup from "./_components/CreateGroup";
import GroupConversationItem from "./_components/GroupConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout: React.FC<Props> = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemsList title="Conversations" action={<CreateGroup />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations
              .map((conv) => {
                if (!conv.conversation) {
                  console.error("Conversation data missing:", conv);
                  return null;
                }

                return conv.conversation.isGroup ? (
                  <GroupConversationItem
                    key={conv.conversation._id}
                    id={conv.conversation._id}
                    name={conv.conversation.name || ""}
                    lastMessageSender={conv.lastMessage?.sender || ""}
                    lastMessageContent={conv.lastMessage?.content || ""}
                  />
                ) : (
                  <DMConversation
                    key={conv.conversation._id}
                    id={conv.conversation._id}
                    username={conv.otherMember?.username || ""}
                    imageUrl={conv.otherMember?.imageUrl || ""}
                    lastMessageSender={conv.lastMessage?.sender || ""}
                    lastMessageContent={conv.lastMessage?.content || ""}
                  />
                );
              })
              .filter(Boolean)
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

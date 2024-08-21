"use client"

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ConversationContainer from "@/components/ui/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  }
};

const ConversationsPage = ({ params }: Props) => {
  const conversations = useQuery(api.conversations.get, { id: params.conversationId });
  return (
    <>
      
    </>
  );
};

export default ConversationsPage;
"use client";

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ConversationContainer from "@/components/ui/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationsPage = () => {
  // Note: We're not using params here since this is the root conversations page
  // and not a specific conversation page with an ID
  return <ConversationFallback />;
};

export default ConversationsPage;

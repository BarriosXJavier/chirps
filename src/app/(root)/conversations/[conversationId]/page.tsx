"use client";

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ConversationContainer from "@/components/ui/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useState } from "react";
import DeleteGroupDialogue from "./_components/dialogs/deleteGroup";
import LeaveGroupDialogue from "./_components/dialogs/leaveGroup";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationsPage = ({ params: conversationId }: Props) => {
  const conversations = useQuery(api.conversation.get, {
    id: conversationId.conversationId,
  });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  return conversations === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : conversations === null || !conversations.conversation ? (
    <p className="w-full h-full flex items-center justify-center">
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <DeleteGroupDialogue
        conversationId={conversationId.conversationId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialogue
        conversationId={conversationId.conversationId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        name={
          conversations.conversation?.isGroup
            ? conversations.conversation.name || "Group"
            : conversations.otherMember?.username || ""
        }
        imageUrl={
          conversations.conversation?.isGroup
            ? undefined
            : conversations.otherMember?.imageUrl || ""
        }
        options={
          conversations.conversation?.isGroup
            ? [
                {
                  label: "Leave Group",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "Delete Group",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "Remove Friend",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationsPage;

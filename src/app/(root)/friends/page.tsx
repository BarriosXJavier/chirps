"use client"

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ItemsList from "@/components/ui/shared/itemlist/itemlist";
import AddFriendDialogue from "./_components/AddFriendDialogue";

const Props = {};

const FriendsPage: React.FC = () => {
  return (
    <>
      <ItemsList title="Friends" action={<AddFriendDialogue />}></ItemsList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;

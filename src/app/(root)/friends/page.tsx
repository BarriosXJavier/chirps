"use client"

import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ItemsList from "@/components/ui/shared/itemlist/itemlist";
import AddFriendDialogue from "./_components/AddFriendDialogue";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";

const Props = {};

const FriendsPage: React.FC = () => {
  const requests = useQuery(api.requests.get)
  return (
    <>
      <ItemsList title="Friends" action={<AddFriendDialogue />}>
        {
          requests ? requests.length == 0 ? <p className="w-full h-full flex items-center justify-center">No requests yet</p> : requests.map((request) => {
            return <Request key={request.request._id} id={request.request._id} imageUrl={request.sender.imageUrl} username={request.sender.username} email={request.sender.email}/>
          }) : <Loader2 className="h-8 w-8"/>
        }
      </ItemsList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;

import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const DMConversation: React.FC<Props> = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent,
}) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          {lastMessageSender && lastMessageContent ? (
            <span className="text-sm text-muted-foreground truncate">
              <strong>{lastMessageSender}:</strong> {lastMessageContent}
            </span>
          ) : (
            <p className="text-sm text-muted-foreground truncate">
              Start conversation
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DMConversation;

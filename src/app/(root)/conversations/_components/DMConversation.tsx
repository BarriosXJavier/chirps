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
    <Link href={`/conversations/${id}`} className="w-full group">
      <Card className="p-3 flex flex-row items-center gap-4 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer border modern-card">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm">
            <AvatarImage src={imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              <UserIcon className="h-5 w-5 text-foreground/70" />
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
        </div>
        <div className="flex flex-col truncate flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-medium truncate">{username}</h4>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-primary/70 rounded-full"></span>
              12:45
            </span>
          </div>
          {lastMessageSender && lastMessageContent ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground truncate mt-0.5 line-clamp-1">
                <span className="font-medium">{lastMessageSender}:</span>{" "}
                {lastMessageContent}
              </span>
              <span className="shrink-0 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ml-1">
                1
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground truncate mt-1 italic flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Start a new conversation</span>
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DMConversation;

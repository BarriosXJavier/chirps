import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserIcon } from "lucide-react";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

const GroupConversationItem: React.FC<Props> = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent,
}) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full group">
      <Card className="p-3 flex flex-row items-center gap-4 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer bg-secondary/30 border modern-card">
        <div className="relative">
          <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/20 shadow-sm">
            <AvatarFallback className="font-semibold text-foreground/70">
              {username.charAt(0).toLocaleUpperCase() +
                username.charAt(1).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="flex flex-col truncate flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-medium truncate flex items-center gap-1">
              {username}
              <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-md">
                Group
              </span>
            </h4>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-primary/70 rounded-full"></span>
              New
            </span>
          </div>
          {lastMessageSender && lastMessageContent ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground truncate mt-0.5 line-clamp-1">
                <span className="font-medium">{lastMessageSender}:</span>{" "}
                {lastMessageContent}
              </span>
              <span className="shrink-0 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ml-1">
                3
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
              >
                <path d="m12 8-9.04 9.06a10.07 10.07 0 0 1 17.64-4.54"></path>
                <path d="M12 8v8"></path>
                <path d="M12 16h8"></path>
              </svg>
              <span>Start group conversation</span>
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default GroupConversationItem;

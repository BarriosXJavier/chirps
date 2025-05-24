import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCheck, Check } from "lucide-react";
import Image from "next/image";

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  type: string;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  createdAt,
  type,
}: Props) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };
  return (
    <div
      className={cn("flex items-end group mb-2", {
        "justify-end": fromCurrentUser,
      })}
    >
      <Avatar
        className={cn(
          "relative w-8 h-8 mb-1 opacity-0 group-hover:opacity-100 transition-opacity",
          { "order-2 ml-2": fromCurrentUser },
          { "order-1 mr-2": !fromCurrentUser },
          { invisible: lastByUser }
        )}
      >
        <AvatarImage src={senderImage} />
        <AvatarFallback className="text-xs font-medium">
          {senderName.substring(0, 1)}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn("flex flex-col w-full max-w-[85%] sm:max-w-[70%]", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-3 rounded-2xl animate-message-pop", {
            "bg-primary text-primary-foreground shadow-md message-from-user":
              fromCurrentUser,
            "bg-secondary text-secondary-foreground shadow-sm message-from-other":
              !fromCurrentUser,
            "rounded-br-sm": !lastByUser && fromCurrentUser,
            "rounded-bl-sm": !lastByUser && !fromCurrentUser,
          })}
        >
          {!lastByUser && !fromCurrentUser && (
            <div className="text-xs font-medium mb-1 text-muted-foreground">
              {senderName}
            </div>
          )}

          {type === "text" ? (
            <p className="text-wrap break-words whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          ) : type === "image" ? (
            <div className="rounded-md overflow-hidden my-1 max-w-[300px] relative group">
              <Image
                src={content[0]}
                alt={content[1] || "Image"}
                width={300}
                height={200}
                className="w-full h-auto object-contain"
                style={{ objectFit: "contain" }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <a
                  href={content[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-black hover:bg-white transition-colors"
                  download={content[1]}
                >
                  Download
                </a>
              </div>
            </div>
          ) : type === "file" ? (
            <div className="bg-background/50 rounded-md p-3 my-1 flex items-center gap-3 max-w-[300px] group hover:bg-background/70 transition-colors">
              <div className="p-2 bg-primary/10 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{content[1]}</p>
                <p className="text-xs text-muted-foreground">
                  {content[2]?.split("/")[1] || "File"} •{" "}
                  {formatFileSize(parseInt(content[3] || "0"))}
                </p>
              </div>
              <a
                href={content[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                download={content[1]}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          ) : null}

          <div
            className={cn("flex w-full mt-1 text-xs items-center gap-1", {
              "justify-end text-primary-foreground/70": fromCurrentUser,
              "justify-start text-secondary-foreground/70": !fromCurrentUser,
            })}
          >
            <span>{formatTime(createdAt)}</span>
            {fromCurrentUser && (
              <span className="flex items-center">
                <CheckCheck className="h-3 w-3 opacity-70" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

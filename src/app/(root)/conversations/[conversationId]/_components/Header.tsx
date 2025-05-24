import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CircleArrowLeft,
  Settings2Icon,
  Search,
  Phone,
  Video,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useConvo } from "../../../../../../hooks/useConvo";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};

const Header = ({ imageUrl, name, options }: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { convoId } = useConvo();

  const searchResults = useQuery(
    api.search.searchMessages,
    convoId && searchQuery.length >= 2
      ? { conversationId: convoId, query: searchQuery }
      : "skip"
  );

  return (
    <div>
      <Card className="w-full flex rounded-xl items-center p-3 justify-between glass-effect border shadow-md glow-effect">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="block lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors hover-scale"
          >
            <CircleArrowLeft size={20} />
          </Link>
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-md">
              <AvatarImage src={imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground font-medium">
                {name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="online-indicator animate-status-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              Online
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Search button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 hover:bg-secondary/80 hover-scale"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden sm:flex h-9 w-9 hover:bg-secondary/80 hover-scale"
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
              className="lucide lucide-phone"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden sm:flex h-9 w-9 hover:bg-secondary/80 hover-scale"
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
              className="lucide lucide-video"
            >
              <path d="m22 8-6 4 6 4V8Z"></path>
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
            </svg>
          </Button>

          {options ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-lg hover:bg-secondary/50 hover-scale"
                >
                  <Settings2Icon size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 animate-scale-in"
              >
                <DropdownMenuLabel>Conversation Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {options.map((option, index) => {
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={option.onClick}
                      className={cn("font-medium cursor-pointer hover-scale", {
                        "text-destructive hover:text-destructive":
                          option.destructive,
                      })}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </Card>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search messages..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {searchQuery.length < 2 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Enter at least 2 characters to search
                </p>
              )}

              {searchQuery.length >= 2 && !searchResults?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages found matching &ldquo;{searchQuery}&rdquo;
                </p>
              )}

              {searchResults?.map((result) => (
                <div
                  key={result.message._id}
                  className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={result.senderImage} />
                      <AvatarFallback className="text-xs">
                        {result.senderName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {result.isCurrentUser ? "You" : result.senderName}
                    </span>
                  </div>
                  <p className="text-sm">{result.preview}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(result.message._creationTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;

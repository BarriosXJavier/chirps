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
import { CircleArrowLeft, Settings2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div>
      <Card className="w-full flex rounded-lg items-center p-2 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/conversations" className="block lg:hidden ">
            <CircleArrowLeft />
          </Link>
          <Avatar className="h-8 w-8">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className="flex gap-2">
            {options ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant="secondary">
                    <Settings2Icon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {options.map((option, index) => {
                    return (
                      <DropdownMenuItem
                        key={index}
                        onClick={option.onClick}
                        className={cn("font-semibold", {"text-destructive": option.destructive})}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Header;

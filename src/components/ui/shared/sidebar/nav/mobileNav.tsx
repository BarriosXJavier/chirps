"use client";

import { Card } from "@/components/ui/card";
import { useNavigation } from "../../../../../../hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/themes/theme-toggle";
import { Badge } from "@/components/ui/badge";

type Props = {
  children?: React.ReactNode;
};

const MobileNav: React.FC<Props> = ({ children }) => {
  const paths = useNavigation();

  return (
    <Card className="fixed bottom-4 w-full items-center flex h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex items-center justify-evenly">
          {paths.map(({ name, href, icon, active, count }) => (
            <li key={name} className="relative">
              <Link href={href}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant={active ? "default" : "outline"}
                    >
                      {icon}
                    </Button>
                    {count ? (
                      <Badge className="absolute left-7 bottom-6">
                        {count}
                      </Badge>
                    ) : null}
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;

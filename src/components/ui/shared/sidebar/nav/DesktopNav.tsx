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
import { ThemeToggle } from "@/components/ui/themes/theme-toggle";
import { Badge } from "@/components/ui/badge";

type Props = {
  children?: React.ReactNode;
};

const DesktopNav: React.FC<Props> = ({ children }) => {
  const paths = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-20 lg:px-3 lg:py-6 glass-effect border shadow-lg rounded-2xl glow-effect">
      <div className="flex flex-col items-center gap-6">
        <Link href="/conversations" className="block">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md animate-pulse-slow hover-scale">
            C
          </div>
        </Link>
        <nav>
          <ul className="flex flex-col items-center gap-5 stagger-child">
            {paths.map(({ name, href, icon, active, count }) => (
              <li key={name} className="relative w-full animate-fade-in">
                <Link href={href} className="block w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant={active ? "default" : "ghost"}
                        className={`rounded-xl h-12 w-12 ${active ? "shadow-md glow-effect" : "hover-scale"}`}
                      >
                        {icon}
                        {count ? (
                          <Badge className="absolute -right-1 -top-1 px-1.5 rounded-full animate-message-pop">
                            {count}
                          </Badge>
                        ) : null}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {name}
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-5">
        <ThemeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-11 w-11 rounded-xl",
            },
          }}
        />
      </div>
    </Card>
  );
};

export default DesktopNav;

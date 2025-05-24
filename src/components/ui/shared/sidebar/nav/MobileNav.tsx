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
import { ThemeToggle } from "@/components/ui/themes/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConvo } from "../../../../../../hooks/useConvo";
import { CircleArrowLeft } from "lucide-react";

type Props = {
  children?: React.ReactNode;
};

const MobileNav: React.FC<Props> = ({ children }) => {
  const paths = useNavigation();

  const { active } = useConvo();

  return (
    <Card
      className={`fixed bottom-4 left-4 right-4 items-center flex h-16 px-3 py-3 lg:hidden glass-effect shadow-xl z-50 rounded-2xl border border-primary/10 backdrop-blur-md animate-slide-up-fade ${active ? "bg-background/90" : ""}`}
    >
      <nav className="w-full">
        <ul
          className={`flex items-center ${active ? "justify-between" : "justify-evenly"}`}
        >
          {!active ? (
            // Navigation for general app view
            <>
              {paths.map(({ name, href, icon, active: isActive, count }) => (
                <li key={name} className="relative hover-scale">
                  <Link href={href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant={isActive ? "default" : "ghost"}
                          className={`rounded-xl ${isActive ? "shadow-sm scale-110 glow-effect" : ""}`}
                        >
                          {icon}
                          {count ? (
                            <Badge className="absolute -right-1 -top-1 px-1.5 text-xs rounded-full animate-message-pop">
                              {count}
                            </Badge>
                          ) : null}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">{name}</TooltipContent>
                    </Tooltip>
                  </Link>
                </li>
              ))}
              <li className="nav-item-hover">
                <ThemeToggle />
              </li>
              <li className="nav-item-hover">
                <UserButton afterSignOutUrl="/" />
              </li>
            </>
          ) : (
            // Navigation for conversation view
            <>
              <li>
                <Link href="/conversations">
                  <Button size="icon" variant="ghost" className="rounded-xl">
                    <CircleArrowLeft size={20} />
                  </Button>
                </Link>
              </li>
              <li className="hover-scale">
                <ThemeToggle />
              </li>
              <li className="hover-scale">
                <UserButton afterSignOutUrl="/" />
              </li>
            </>
          )}
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;

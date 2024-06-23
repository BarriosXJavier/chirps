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

type Props = {
  children?: React.ReactNode;
}

const DesktopNav: React.FC<Props> = ({ children }) => {
  const paths = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg-py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.map(({ name, href, icon, active }) => (
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
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <UserButton />
      </div>
    </Card>
  );
};

export default DesktopNav;

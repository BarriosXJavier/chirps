"use client";

import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";
import { useEffect, useState } from "react";
import { useConvo } from "../../../../../hooks/useConvo";

type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = ({ children }: Props) => {
  const { active } = useConvo();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full w-full p-2 sm:p-3 md:p-4 flex flex-col lg:flex-row gap-2 md:gap-4 bg-background mobile-bottom-padding">
      <DesktopNav />
      <MobileNav />
      <main
        className={`h-[calc(100%-72px)] lg:h-full w-full flex gap-3 animate-fade-in mobile-bottom-padding ${active ? "pb-20 lg:pb-0" : ""}`}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarWrapper;

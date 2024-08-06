import { MessageSquare, User2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: "Convos",
        href: "/convos",
        icon: <MessageSquare />,
        active: pathname.startsWith("/convos"),
      },

      {
        name: "Friends",
        href: "/friends",
        icon: <User2Icon />,
        active: pathname.startsWith("/buddies"),
      },
    ],
    [pathname],
  );

  return paths;
};

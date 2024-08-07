import { useQuery } from "convex/react";
import { MessageSquare, User2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { api } from "../convex/_generated/api";

export const useNavigation = () => {
  const pathname = usePathname();

  const requestsCount = useQuery(api.requests.count)

  const paths = useMemo(
    () => [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
      },

      {
        name: "Friends",
        href: "/friends",
        icon: <User2Icon />,
        active: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathname, requestsCount],
  );

  return paths;
};

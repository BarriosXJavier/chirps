import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConvo = () => {
  const params = useParams();

  // Handle both param names - the app seems to use both conversationId and convoId in different places
  const convoId = useMemo(() => {
    const id = params?.conversationId || params?.convoId || "";
    if (!id) {
      console.warn("No conversation ID found in params:", params);
    }
    return id as string;
  }, [params]);

  const active = useMemo(() => !!convoId, [convoId]);

  return {
    active,
    convoId,
  };
};

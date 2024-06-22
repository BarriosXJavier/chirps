import { useParams } from "next/navigation";
import { useMemo } from "react";
import { action } from "../convex/_generated/server";

export const useConvo = () => {
    const params = useParams();
    const convoId = useMemo(
      () => {
        return params?.convoId || ("" as string);
      },
      [params?.convoId]
    );
      
    const active = useMemo(() => {
        return convoId;
    }, [convoId]);

    return {
        active, convoId
    };
};
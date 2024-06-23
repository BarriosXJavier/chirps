import { useParams } from "next/navigation"
import { useMemo } from "react";

export const useConvo = () => {
  const params = useParams();

  const convoId = useMemo(() => 
    params?.convoId || ("" as string)
  , [params?.convoId])

  const active = useMemo(() => !! convoId, [convoId])

  return {
    active, convoId
  }
}
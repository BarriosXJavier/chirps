// call any mutation from the backend to create a conversation, request, etc

import { useMutation } from "convex/react";
import { useState } from "react";

/**
 * Custom hook for managing mutation state.
 * @param mutationToRun - The mutation function to be executed.
 * @returns An object containing the mutate function and the pending state.
 */
export const useMutationState = (mutationToRun: any) => {
  const [pending, setPending] = useState(false);
  const mutationFn = useMutation(mutationToRun);

  const mutate = (payload: any) => {
    setPending(true);

    return mutationFn(payload)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => setPending(false));
  };

  return { mutate, pending }
};

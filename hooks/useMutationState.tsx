// call any mutation from the backend to create a conversation, request, etc

import { useMutation } from "convex/react";
import { useState } from "react";
import { ConvexError } from "convex/values";

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
        console.error("Mutation error:", error);

        // Add debugging for Convex errors
        if (error instanceof ConvexError) {
          console.log("ConvexError detected:");
          console.log("- Data:", error.data);
          console.log("- Message:", error.message);
          console.log("- Name:", error.name);
        } else {
          console.log("Non-ConvexError:", error);
        }

        // Ensure we're propagating the error correctly
        throw error;
      })
      .finally(() => setPending(false));
  };

  return { mutate, pending };
};

import { ConvexError } from "convex/values";

/**
 * Helper function to properly extract error messages from Convex errors
 * @param error The error object returned from a Convex mutation
 * @returns A formatted error message string
 */
export const getErrorMessage = (error: unknown): string => {
  console.error("Error details:", error);

  if (error instanceof ConvexError) {
    // Handle ConvexError specifically
    if (error.data) {
      return String(error.data);
    }
    if (error.message) {
      return error.message;
    }
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return error.message;
  }

  // If we can't extract a meaningful message, return a generic one
  return "An unexpected error occurred";
};

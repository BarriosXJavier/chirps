"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useMutationState } from "../../../../../../../hooks/useMutationState";
import { api } from "../../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  conversationId: Id<"conversations">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const RemoveFriendDialogue = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = useMutationState(api.friend.remove);
  const handleRemoveFriend = async () => {
    removeFriend({ conversationId })
      .then((result) => {
        toast.success("Friend removed");
        setOpen(false); // Close the dialog after successful removal
      })
      .catch((error) => {
        console.error("Error removing friend:", error);
        toast.error(
          error instanceof ConvexError
            ? String(error.data)
            : "Unexpected error occurred"
        );
      });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogHeader>
        <AlertDialogTitle>Remove friend?</AlertDialogTitle>
        <AlertDialogDescription>
          By removing this friend, ALL messages will be lost and this action
          cannot be reversed
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={pending} onClick={handleRemoveFriend}>
          Remove
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

export default RemoveFriendDialogue;

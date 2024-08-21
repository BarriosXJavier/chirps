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

const DeleteGroupDialogue = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: deleteGroup, pending } = useMutationState(api.conversation.deleteGroup);
  
  const handleDeleteGroup = async () => {
    deleteGroup({ conversationId })
      .then(() => {
        toast.success("Group deleted");
        setOpen(false); // Close the dialog after successful deletion
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Unexpected error occurred"
        );
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete group?</AlertDialogTitle>
        <AlertDialogDescription>
          By deleting this group, ALL messages will be lost and this action
          cannot be reversed.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending} onClick={() => setOpen(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction disabled={pending} onClick={handleDeleteGroup}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

export default DeleteGroupDialogue;
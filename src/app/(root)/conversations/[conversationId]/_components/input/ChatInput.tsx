"use client";

import { Card } from "@/components/ui/card";
import React, { useRef, useCallback, useState } from "react";
import { ConvexError, v } from "convex/values";
import { z } from "zod";
import { useConvo } from "../../../../../../../hooks/useConvo";
import { useMutationState } from "../../../../../../../hooks/useMutationState";
import { api } from "../../../../../../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import TextAreaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import {
  SendHorizonalIcon,
  Image as ImageIcon,
  Paperclip,
  Mic,
  PlusCircle,
  Smile,
  X,
} from "lucide-react";
import { useMutation } from "convex/react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TypingIndicator } from "./TypingIndicator";
import { Progress } from "@/components/ui/progress";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
});

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { convoId } = useConvo();
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveStorageId = useMutation(api.storage.saveStorageId);
  const updateTyping = useMutation(api.typing.update);

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Handle file upload with react-dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!convoId) {
        toast.error("Conversation not found");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setUploadProgress(10);

        // Get upload URL from Convex
        const uploadUrl = await generateUploadUrl();
        if (!uploadUrl) {
          throw new Error("Failed to get upload URL");
        }

        setUploadProgress(20);

        // Upload the file to the Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Upload failed: ${result.statusText}`);
        }

        setUploadProgress(70);

        // Get the storage ID from the upload response
        const { storageId } = await result.json();
        if (!storageId) {
          throw new Error("Failed to get storage ID");
        }

        setUploadProgress(90);

        // Save the storage ID to the database
        await saveStorageId({
          fileId: storageId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          conversationId: convoId,
        });

        setUploadProgress(100);

        toast.success("File uploaded successfully!");
        setIsFileDialogOpen(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    },
    [convoId, generateUploadUrl, saveStorageId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);

      // Send typing indicator
      if (convoId && value) {
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        updateTyping({
          conversationId: convoId,
          isTyping: true,
        });

        const timeout = setTimeout(() => {
          updateTyping({
            conversationId: convoId,
            isTyping: false,
          });
        }, 3000);

        setTypingTimeout(timeout);
      }
    }
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    if (!convoId) {
      toast.error("Unable to send message: conversation not found");
      return;
    }

    // Clear typing status when sending a message
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      updateTyping({
        conversationId: convoId,
        isTyping: false,
      });
    }

    createMessage({
      convoId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        toast.error(
          error instanceof ConvexError
            ? String(error.data)
            : "Oops, something went wrong and an unexpected error occurred"
        );
      });
  };
  return (
    <Card className="w-full p-3 rounded-xl shadow-md relative glass-effect border-t glow-effect">
      <TypingIndicator />

      <div className="flex gap-2 items-end w-full">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 shrink-0 hidden sm:flex hover:bg-secondary/80 hover-scale"
        >
          <PlusCircle size={18} />
        </Button>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <div className="w-full flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 shrink-0 hover:bg-secondary/80"
              >
                <Smile size={18} />
              </Button>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  return (
                    <FormItem className="h-full w-full">
                      <FormControl>
                        <TextAreaAutosize
                          onKeyDown={async (e) => {
                            if (e.key == "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (field.value?.trim()) {
                                await form.handleSubmit(handleSubmit)();
                              }
                            }
                          }}
                          rows={1}
                          maxRows={4}
                          {...field}
                          onChange={handleInputChange}
                          onClick={handleInputChange}
                          placeholder="Type a message..."
                          className="min-h-full w-full resize-none border-0 outline-0 bg-transparent text-foreground placeholder:text-muted-foreground py-2 text-base focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 shrink-0 hover:bg-secondary/80"
                onClick={() => setIsFileDialogOpen(true)}
              >
                <Paperclip size={18} />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 shrink-0 hover:bg-secondary/80"
                onClick={() => setIsFileDialogOpen(true)}
              >
                <ImageIcon size={18} />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={pending || !form.getValues("content")?.trim()}
              size="icon"
              className="rounded-full h-10 w-10 transition-all hover-scale bg-primary text-primary-foreground shadow-sm flex-shrink-0"
            >
              {pending ? (
                <div className="flex gap-0.5">
                  <div
                    className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              ) : (
                <SendHorizonalIcon size={18} />
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* File Upload Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload an image or file to share in this conversation.
            </DialogDescription>
          </DialogHeader>

          <div
            {...getRootProps()}
            className={`
              mt-4 p-6 border-2 border-dashed border-primary/40 rounded-lg 
              flex flex-col items-center justify-center cursor-pointer
              transition-colors hover:bg-primary/5
              ${isUploading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="w-full space-y-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground mb-2">
                    Uploading...
                  </span>
                  <Progress value={uploadProgress} className="w-full h-2" />
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Paperclip className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">
                  Drag files here or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports images and documents up to 5MB
                </p>
              </>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFileDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChatInput;

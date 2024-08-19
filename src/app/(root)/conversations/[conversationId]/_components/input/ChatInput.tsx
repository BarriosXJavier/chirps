"use client";

import { Card } from "@/components/ui/card";
import React, { useRef } from "react";
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
import { SendHorizonalIcon } from "lucide-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
});

const handleInputChange = (event: any) => {
  const { value, selectionStart } = event.target;

  if (selectionStart !== null) {
    form.setValue("content", value);
  }
};

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { convoId } = useConvo();
  const { mutate, createMessage, pending } = useMutationState(
    api.message.create
  );
  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      convoId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Ooops, something went wrong and an unexpected error occurred"
        );
      });
  };
  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextAreaAutosize
                        onKeyDown={async (e) => {
                          if (e.key == "Enter" && !e.shiftKey)
                            e.preventDefault();
                          await form.handleSubmit(handleSubmit)();
                        }}
                        rows={1}
                        maxRows={3}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="Type message..."
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" disabled={pending} size="icon">
              <SendHorizonalIcon />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;

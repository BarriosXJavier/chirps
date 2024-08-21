"use client";

import { useQuery } from "convex/react";
import React, { useMemo } from "react";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { useMutationState } from "../../../../../hooks/useMutationState";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon, X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type Props = {};

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  members: z
    .array(z.string())
    .min(2, { message: "At least 2 members are required to create a group" }),
});

const CreateGroup = (props: Props) => {
  const friends = useQuery(api.friends.get);
  const { mutate: createGroup, pending } = useMutationState(
    api.conversations.createGroup
  );

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);
  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter(
          (friend: { _id: string }) => !members.includes(friend._id)
        )
      : [];
  }, [friends, members]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    await createGroup({ name: values.name, members: values.members })
      .then(() => {
        form.reset();
        toast.success("Group created successfully");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "An unexpected error occured"
        );
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <CirclePlusIcon className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a group</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group</DialogTitle>
          <DialogDescription>Add friends to the group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Group name..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friends</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={unselectedFriends.length === 0}
                      >
                        <Button className="w-full" variant="outline">
                          Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full ">
                        {unselectedFriends.map((friend) => (
                          <DropdownMenuCheckboxItem
                            key={friend._id}
                            className="flex items-center justify-center gap-w w-full p-2"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("members", [
                                  ...members,
                                  friend._id,
                                ]);
                              } else {
                                form.setValue("members", members.filter(id => id !== friend._id));
                              }
                            }}
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>
                                {friend.username.substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h4 className="text-sm font-medium truncate">
                              {friend.username}
                            </h4>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />

                  
                </FormItem>
              )}
            />
            {members && members.length ? (
              <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                {friends?.filter((friend) => members.includes(friend._id)).map((friend) => {
                  return (
                    <div
                      key={friend._id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.imageUrl} />
                          <AvatarFallback>
                            {friend.username.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <X className="text-muted-foreground h-4 w-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer" onClick={() => {
                          form.setValue("members", members.filter(id => id !== friend._id))
                        }}/>
                      </div>
                      <p className="text-sm font-medium truncate">{friend.username.split(" ")[0]}</p>
                    </div>
                  );
                })}
              </Card>
            ) : null}
            <DialogFooter>
                <Button disabled={pending} type="submit">
                    Create
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
import React from "react";
import { TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { TooltipContent } from "@radix-ui/react-tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {};

const AddFriendSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty!" })
    .email("Please enter a valid email"),
});

const AddFriendDialogue = (props: Props) => {
  const form = useForm<z.infer<typeof AddFriendSchema>>({
    resolver: zodResolver(AddFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = () => {};
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button size="icon" variant="outline">
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Friend</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>Send request to connect</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>
        <DialogFooter>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm">Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialogue;

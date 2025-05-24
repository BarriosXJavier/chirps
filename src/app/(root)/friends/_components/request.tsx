import { Id } from "../../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckIcon, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutationState } from "../../../../../hooks/useMutationState";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { getErrorMessage } from "../../../../../hooks/useErrorHandling";

type Props = {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, imageUrl, username, email }: Props) => {
  const { mutate: denyRequest, pending: denyPending } = useMutationState(
    api.request.deny
  );

  const { mutate: acceptRequest, pending: acceptPending } = useMutationState(
    api.request.accept
  );

  return (
    <Card className="w-full p-3 flex flex-row items-center justify-between gap-2 hover:bg-secondary/20 transition-colors rounded-xl shadow-sm glass-effect">
      <div className="flex items-center gap-4 truncate">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-md">
            <AvatarImage src={imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium shadow-md animate-pulse">
            <span>!</span>
          </div>
        </div>
        <div className="flex flex-col truncate">
          <h4 className="font-medium truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full h-10 w-10 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-600 transition-all hover-scale shadow-sm"
          onClick={() => {
            acceptRequest({ id }) // Pass as object with named 'id' property
              .then((result) => {
                toast.success("Friend request accepted");
              })
              .catch((error) => {
                console.error("Error accepting request:", error);
                toast.error(getErrorMessage(error));
              });
          }}
          disabled={acceptPending || denyPending}
        >
          <CheckIcon className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full h-10 w-10 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all hover-scale shadow-sm"
          onClick={() => {
            denyRequest({ id }) // Pass as object with named 'id' property
              .then((result) => {
                toast.success("Friend request denied");
              })
              .catch((error) => {
                console.error("Error denying request:", error);
                toast.error(getErrorMessage(error));
              });
          }}
          disabled={acceptPending || denyPending}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;

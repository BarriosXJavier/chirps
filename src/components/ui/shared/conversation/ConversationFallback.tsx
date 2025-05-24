import { Card } from "@/components/ui/card";
import { MessageCircle, UserPlus } from "lucide-react";

const ConversationFallback: React.FC = () => {
  return (
    <Card className="hidden lg:flex flex-col h-full w-full p-6 items-center justify-center bg-secondary text-secondary-foreground gap-4">
      <div className="flex items-center gap-2 text-xl font-medium">
        <MessageCircle className="h-6 w-6" />
        <h2>No conversation selected</h2>
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        Select an existing conversation from the sidebar or add a new friend to
        start chatting.
      </p>
      <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
        <UserPlus className="h-4 w-4" />
        <span>Use the Add Friend button to connect with others</span>
      </div>
    </Card>
  );
};

export default ConversationFallback;

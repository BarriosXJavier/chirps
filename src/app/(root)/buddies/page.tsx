import ConversationFallback from "@/components/ui/shared/conversation/ConversationFallback";
import ItemsList from "@/components/ui/shared/itemlist/itemlist";

const Props = {};

const BuddiesPage: React.FC = () => {
  return (
    <>
      <ItemsList title="Friends">Friend List</ItemsList>
      <ConversationFallback />
    </>
  );
};

export default BuddiesPage;

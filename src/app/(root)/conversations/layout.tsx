import React from "react";
import ItemsList from "@/components/ui/shared/itemlist/itemlist";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      {children}
    </>
  );
};

export default ConversationsLayout;

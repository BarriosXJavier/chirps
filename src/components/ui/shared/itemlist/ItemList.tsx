"use client";

import { useConvo } from "../../../../../hooks/useConvo";
import { Card } from "../../card";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{
  title: string;
  action?: React.ReactNode;
}>;

const ItemsList = ({ children, title, action: Action }: Props) => {
  const { active } = useConvo();
  return (
    <Card
      className={cn(
        "h-full w-full lg:flex-none lg:w-96 p-4",
        {
          block: !active,
          "lg:block": active,
        },
        "glass-effect border shadow-md rounded-xl"
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight">{title}</h1>
        {Action ? Action : null}
      </div>
      <div className="w-full h-[calc(100%-60px)] flex flex-col overflow-y-auto pb-2 pr-1 gap-3">
        {children}
      </div>
    </Card>
  );
};

export default ItemsList;

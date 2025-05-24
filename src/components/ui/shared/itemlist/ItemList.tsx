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
      className={cn("h-full w-full lg:flex-none lg:w-80 p-2", {
        block: !active,
        "lg:block": active,
      })}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        {Action ? Action : null}
        <div className="w-full h-full flex flex-col items-center justify-start gap-2">
          {children}
        </div>
      </div>
    </Card>
  );
};

export default ItemsList;

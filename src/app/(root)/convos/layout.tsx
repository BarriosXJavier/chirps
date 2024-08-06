import ItemsList from "@/components/ui/shared/itemlist/itemlist";

type Props = React.PropsWithChildren<{}>;

const ConvosLayout = ({ children }: Props) => {
  return;
  <>
    <ItemsList title="convos">{children}</ItemsList>
    {children}
  </>;
};

export default ConvosLayout;

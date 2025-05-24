import SidebarWrapper from "@/components/ui/shared/sidebar/SidebarWrapper";

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <>
      <SidebarWrapper>{children}</SidebarWrapper>
    </>
  );
};

export default Layout;

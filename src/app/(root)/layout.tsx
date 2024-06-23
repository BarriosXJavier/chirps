import SidebarWrapper from "@/components/ui/shared/sidebar/sidebarWrapper";

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;

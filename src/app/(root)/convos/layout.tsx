import SidebarWrapper from "@/components/ui/shared/sidebar/sidebarWrapper";

type Props = React.PropsWithChildren<{}>

const ConvosLayout: React.FC = ({ children }: Props) => {
    return(
        <SidebarWrapper>{children}</SidebarWrapper>
    );
}

export default ConvosLayout;
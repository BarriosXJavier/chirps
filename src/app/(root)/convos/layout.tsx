type Props = React.PropsWithChildren<{}>

const ConvosLayout: React.FC = ({ children }: Props) => {
    return(
        <div>
            {children}
        </div>
    );
}

export default ConvosLayout;
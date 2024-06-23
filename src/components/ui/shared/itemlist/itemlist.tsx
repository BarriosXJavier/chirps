import { Card } from "../../card";

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode;
}>

const ItemsList = ({ children, title, action }: Props) => {
    return(
        <Card className="h-full w-full lg:flex-none lg:w-80 p-2">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
                {action ? action : null}
                <div className="w-full h-full flex flex-col items-center justify-start gap-2">{children}</div>
            </div>

        </Card>
    );
}

export default ItemsList;
import { useEffect } from "react";

export const TitlePageWrapper = ({
    children,
    title = document.title,
}: {
    children: React.ReactNode;
    title: string;
}) => {
    useEffect(() => {
        document.title = title;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    return <>{children}</>;
};

import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider/AuthProvider";

export const PrivateRoute = ({
    children,
}: {
    children: React.ReactElement;
}) => {
    const { profile } = useContext(AuthContext);

    if (profile.role !== "root_admin") return <div>Permission Denied</div>;
    return <>{children}</>;
};

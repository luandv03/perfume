import React, { useEffect, useContext } from "react";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider/AuthProvider";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("isAuthenticated") as string)) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile.customer_id]);

    if (!JSON.parse(localStorage.getItem("isAuthenticated") as string))
        return (
            <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Bummer!"
                color="red"
            >
                Bạn đã đăng ký tải khoản chưa? Nếu có rồi thì hãy{" "}
                <Link to="/login" style={{ fontWeight: 500 }}>
                    đăng nhập
                </Link>{" "}
                trước nhé
            </Alert>
        );

    return <>{children}</>;
};

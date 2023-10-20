import React from "react";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
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

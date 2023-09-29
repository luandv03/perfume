import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Center, Text } from "@mantine/core";

export const LoginGoogleSuccess = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("access_token_user") as string) {
            localStorage.setItem(
                "access_token_user",
                searchParams.get("access_token_user") as string
            );

            localStorage.setItem(
                "refresh_token_user",
                searchParams.get("refresh_token_user") as string
            );
        }

        const timer = setTimeout(() => {
            window.close();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Center>
            <Alert title="Bummer!" color="red">
                <Text fw={700}> Bạn đã đăng nhập thành công</Text>
            </Alert>
        </Center>
    );
};

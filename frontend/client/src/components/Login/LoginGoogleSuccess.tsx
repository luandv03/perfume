import { useEffect } from "react";

import { Alert, Center, Text } from "@mantine/core";

export const LoginGoogleSuccess = () => {
    useEffect(() => {
        setTimeout(() => {
            window.close();
        }, 300);
    }, []);

    return (
        <Center>
            <Alert title="Bummer!" color="red">
                <Text fw={700}> Bạn đã đăng nhập thành công</Text>
            </Alert>
        </Center>
    );
};

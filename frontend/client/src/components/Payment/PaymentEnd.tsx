import { Center, Text, Button, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const PaymentEnd = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("code") as string) {
            localStorage.setItem("code", searchParams.get("code") as string);
        }

        const timer = setTimeout(() => {
            window.close();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Center>
            {searchParams.get("code") == "00" ? (
                <Text fw={500} size="lg" color="red">
                    successful transaction
                </Text>
            ) : (
                <Stack>
                    {" "}
                    <Text
                        fw={500}
                        size="lg"
                        color="red"
                        sx={{ textAlign: "center" }}
                    >
                        Transaction failed
                    </Text>
                    <Button>Refund the order</Button>
                </Stack>
            )}
        </Center>
    );
};

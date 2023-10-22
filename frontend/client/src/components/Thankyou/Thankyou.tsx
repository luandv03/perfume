import { Center, Text, Button, Group, Stack } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const Thankyou = () => {
    return (
        <Center>
            <Stack>
                <Group>
                    <IconCircleCheck color="green" size={60}></IconCircleCheck>
                    <Text fw={700} size="lg">
                        Thank you ordered
                    </Text>
                </Group>
                <Link to="/">
                    <Button>Continue shopping</Button>
                </Link>
            </Stack>
        </Center>
    );
};

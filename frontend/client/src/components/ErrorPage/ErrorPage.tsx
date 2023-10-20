import { Center, Stack, Text } from "@mantine/core";

export const ErrorPage = () => {
    return (
        <Center bg="#f4f8ff" h="100vh">
            <Stack align="center">
                <Text fw={500} size={24} color="blue">
                    Oops!
                </Text>
                <Text size={20} color="#70829a">
                    Sorry, an unexpected error has occurred.
                </Text>
                <Text fw={600} size={40} color="blue">
                    404 PAGE NOT FOUND
                </Text>
            </Stack>
        </Center>
    );
};

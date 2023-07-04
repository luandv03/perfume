import { Flex, Box, Button, Stack, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

export const CategoryCreate = () => {
    return (
        <Stack>
            <TextInput
                placeholder="Category name..."
                label="Category name"
                withAsterisk
                miw={400}
            />

            <Flex style={{ width: "100%", marginTop: "20px" }}>
                <Box
                    sx={(theme) => ({
                        width: "100%",
                        height: "65px",
                        backgroundColor: theme.colors.gray[1],
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    })}
                >
                    <Flex
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        justify="space-between"
                        align="center"
                    >
                        <Button
                            size="md"
                            radius="md"
                            sx={() => ({
                                cursor: "pointer",
                                "&hover": {
                                    opacity: "0.9",
                                },
                            })}
                            disabled
                        >
                            <IconDeviceFloppy style={{ marginRight: "5px" }} />
                            Save
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Stack>
    );
};

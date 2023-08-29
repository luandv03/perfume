import { useState } from "react";
import { Flex, Box, Button, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";

import { categoryService } from "../../services/category.service";

export const CategoryCreate = () => {
    const [categoryName, setCategoryName] = useState("");

    const handleCreateCategory = async () => {
        const data = await categoryService.createCategory(categoryName);

        notifications.show({
            title: "Default notification",
            message: data.message + ": " + data.statusCode,
        });
    };

    return (
        <Stack>
            <TextInput
                placeholder="Category name..."
                label="Category name"
                withAsterisk
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
                            disabled={!categoryName}
                            onClick={() => handleCreateCategory()}
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

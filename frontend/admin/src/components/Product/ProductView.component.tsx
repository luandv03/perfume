import { useLocation } from "react-router-dom";
import { Tabs, Text, Flex, Box, Button } from "@mantine/core";
import {
    IconPhoto,
    IconMessageCircle,
    IconSettings,
    IconDeviceFloppy,
    IconTrash,
} from "@tabler/icons-react";
import { Link, Outlet } from "react-router-dom";

export function ProductView() {
    const location = useLocation();

    return (
        <Tabs
            value={location.pathname} // this is active current link location
            defaultValue="/product/:product_id/image"
            sx={{ width: "100%" }}
        >
            <Tabs.List>
                <Tabs.Tab
                    fw={400}
                    value="/product/:product_id/image"
                    icon={<IconPhoto size="0.8rem" />}
                >
                    <Link
                        to="/product/:product_id/image"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Ảnh</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value="/product/:product_id/detail"
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Link
                        to="/product/:product_id/detail "
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Chi tiết</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value="/product/:product_id/description"
                    icon={<IconSettings size="0.8rem" />}
                >
                    <Link
                        to="/product/:product_id/description"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Mô tả</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value="/product/:product_id/feedback"
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Link
                        to="/product/:product_id/feedback"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Đánh giá</Text>
                    </Link>
                </Tabs.Tab>
            </Tabs.List>

            <Outlet />

            {/* //footer */}
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
                        <Button
                            size="md"
                            radius="md"
                            variant="subtle"
                            color="gray"
                            sx={(them) => ({
                                color: "red",
                                "&hover": {
                                    backgroundColor: them.colors.black,
                                },
                            })}
                        >
                            <IconTrash
                                style={{
                                    marginRight: "5px",
                                }}
                            />
                            Delete
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Tabs>
    );
}

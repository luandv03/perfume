import { Flex, Stack, Text } from "@mantine/core";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Customer() {
    const location = useLocation();

    return (
        <div style={{ width: "100%" }}>
            <Flex>
                <Stack sx={{ height: "100%" }}>
                    <Text size={20}>Trang tài khoản</Text>
                    <Link to="/customer">
                        <Text
                            color={
                                location.pathname === "/customer"
                                    ? "red"
                                    : "black"
                            }
                        >
                            Thông tin tài khoản
                        </Text>
                    </Link>

                    <Link to="/customer/orders">
                        <Text
                            color={
                                location.pathname === "/customer/orders"
                                    ? "red"
                                    : "black"
                            }
                        >
                            Đơn hàng của bạn
                        </Text>
                    </Link>
                </Stack>
                <div style={{ paddingLeft: "20px" }}>
                    <Outlet />
                </div>
            </Flex>
        </div>
    );
}

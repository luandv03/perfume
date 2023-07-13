import { Group, Stack, Text } from "@mantine/core";
import { Outlet, Link } from "react-router-dom";

export default function Customer() {
    return (
        <Group sx={{ width: "100%" }} position="apart">
            <div
                style={{
                    display: "flex",
                    height: "calc(100%-80px)",
                }}
            >
                <Stack>
                    <Text size={20}>Trang tài khoản</Text>
                    <Text size={16} fw={500}>
                        Xin chào, Văn Luận Đinh
                    </Text>
                    <Link to="/customer">
                        <Text color="black">Thông tin tài khoản</Text>
                    </Link>

                    <Link to="/customer/orders">
                        <Text color="black">Đơn hàng của bạn</Text>
                    </Link>
                </Stack>
            </div>
            <Outlet />
        </Group>
    );
}

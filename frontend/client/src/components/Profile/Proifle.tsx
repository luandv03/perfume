import { Text, Group, Stack } from "@mantine/core";

export function Profile() {
    return (
        <Stack>
            <Text>Thông tin tài khoản</Text>
            <Group>
                <Text size="16px" fw={500}>
                    Họ và Tên:
                </Text>
                <Text fw={500} color="gray">
                    Đinh Văn Luận
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Email:
                </Text>
                <Text fw={500} color="gray">
                    dinhvanluan2k3@gmail.com
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Số điện thoại:
                </Text>
                <Text fw={500} color="gray">
                    0867801606
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Địa chỉ:
                </Text>
                <Text fw={500} color="gray">
                    66 Nguyễn Sỹ Sách, Phường 15, Tân Bình
                </Text>
            </Group>
        </Stack>
    );
}

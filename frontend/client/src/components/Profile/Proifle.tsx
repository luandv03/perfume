import { Text, Group, Stack } from "@mantine/core";

import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { useContext } from "react";

export function Profile() {
    const { profile } = useContext(AuthContext);

    return (
        <Stack>
            <Text>Thông tin tài khoản</Text>
            <Group>
                <Text size="16px" fw={500}>
                    Họ và Tên:
                </Text>
                <Text fw={500} color="gray">
                    {profile.fullname}
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Email:
                </Text>
                <Text fw={500} color="gray">
                    {profile.email}
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Số điện thoại:
                </Text>
                <Text fw={500} color="gray">
                    {profile.phone_number}
                </Text>
            </Group>
            <Group>
                <Text size="16px" fw={500}>
                    Địa chỉ:
                </Text>
                <Text fw={500} color="gray">
                    {profile.address}
                </Text>
            </Group>
        </Stack>
    );
}

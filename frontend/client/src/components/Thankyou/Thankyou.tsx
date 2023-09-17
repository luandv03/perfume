// import { useState } from 'react'
import { Center, Text } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

export const Thankyou = () => {
    return (
        <Center>
            <IconCircleCheck color="green" size={60}></IconCircleCheck>
            <Text fw={700} size="lg">
                Cảm ơn bạn đã đặt hàng
            </Text>
        </Center>
    );
};

import {
    Stack,
    Divider,
    Text,
    Group,
    Radio,
    SimpleGrid,
    Pagination,
    Center,
} from "@mantine/core";
import { Product } from "../Product/Product";

export function FilterResult() {
    return (
        <Stack
            sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
            spacing={10}
            p={10}
        >
            <Text size="24px" fw={500}>
                Nước hoa Nam
            </Text>
            <Group align="center">
                <Text fw={500}>Xếp theo: </Text>
                <Radio.Group>
                    <Group mt="xs">
                        <Radio value="react" label="Hàng mới" />
                        <Radio value="ng" label="Giá từ thấp đến cao" />
                        <Radio value="svelte" label="Giá từ cao xuống thấp" />
                    </Group>
                </Radio.Group>
            </Group>
            <Divider my="xs"></Divider>
            <SimpleGrid cols={4} spacing={0}>
                {[1, 2, 3, 4, 5, 6, 7, 7, 8, 9].map(() => (
                    <Product />
                ))}
            </SimpleGrid>
            <Center>
                <Pagination total={10} />
            </Center>
        </Stack>
    );
}

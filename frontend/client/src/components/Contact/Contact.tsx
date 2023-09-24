import { Flex, Stack, Text, TextInput, Textarea, Button } from "@mantine/core";
import { IconMapPin, IconPhone, IconMail } from "@tabler/icons-react";

export const Contact = () => {
    return (
        <Stack>
            <Flex
                p={10}
                sx={{
                    border: "1px solid #f0e7e7",
                    borderRadius: "4px",
                    "@media (max-width: 48em)": {
                        flexDirection: "column",
                    },
                }}
                gap={20}
            >
                <Stack>
                    <Text fw={700} size="xl">
                        Liên hệ
                    </Text>
                    <Flex>
                        <IconMapPin />
                        &nbsp;
                        <Text>
                            1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội
                        </Text>
                    </Flex>
                    <Flex>
                        <IconPhone />
                        &nbsp;
                        <Text>024 3869 6099</Text>
                    </Flex>
                    <Flex>
                        <IconMail />
                        &nbsp;
                        <Text>bkhn@gmail.com</Text>
                    </Flex>
                </Stack>

                <Stack>
                    <Text fw={700} size="xl">
                        Gửi thông tin
                    </Text>
                    <Text>
                        Bạn hãy điền đầy đủ các thông tin bên dưới và gửi cho
                        chúng tôi. Chúng tôi sẽ trả lời sau khi nhận được.
                    </Text>
                    <Flex justify="space-between" gap={20}>
                        <TextInput
                            mt="md"
                            label="Họ và tên"
                            style={{ width: "50%" }}
                        />
                        <TextInput
                            mt="md"
                            label="Email"
                            style={{ width: "50%" }}
                        />
                    </Flex>
                    <Textarea
                        label="Nội dung"
                        style={{ width: "100%" }}
                        minRows={4}
                    />
                    <Button color="gray" size="sm">
                        Gửi tin nhắn
                    </Button>
                </Stack>
            </Flex>
        </Stack>
    );
};

import {
    Flex,
    Stack,
    Text,
    TextInput,
    Textarea,
    Button,
    Alert,
} from "@mantine/core";
import {
    IconMapPin,
    IconPhone,
    IconMail,
    IconLoader,
} from "@tabler/icons-react";
import { hasLength, useForm } from "@mantine/form";
import { useState } from "react";

export const Contact = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>("");

    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            content: "",
        },

        validateInputOnBlur: true,

        validate: {
            name: hasLength({ min: 1 }, "Name cannot be blank"),
            content: hasLength({ min: 1 }, "Content cannot be empty"),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
        },
    });

    const handleSendMail = async (payload: {
        name: string;
        email: string;
        content: string;
    }) => {
        if (form.errors.name || form.errors.email || form.errors.content)
            return;

        /// call api
        setLoading(true);
        console.log(payload);
        setLoading(false);
        setNotification(
            "Thank you for contacting us. We will contact you as soon as possible."
        );
        form.reset();
    };

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
                        Contact
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
                        <Text>perfumeld03@gmail.com</Text>
                    </Flex>
                </Stack>

                <Stack>
                    <Text fw={700} size="xl">
                        Send information
                    </Text>
                    <Text>
                        Please fill in the information below and send it to us.
                        We will respond upon receipt.
                    </Text>
                    {!!notification.length && (
                        <Alert color="red">
                            <Text color="rgb(214 28 28)">{notification}</Text>
                        </Alert>
                    )}
                    <Flex justify="space-between" gap={20}>
                        <TextInput
                            mt="md"
                            label="Fullname"
                            style={{ width: "50%" }}
                            {...form.getInputProps("name")}
                        />
                        <TextInput
                            mt="md"
                            label="Email"
                            style={{ width: "50%" }}
                            {...form.getInputProps("email")}
                        />
                    </Flex>
                    <Textarea
                        label="Comment"
                        style={{ width: "100%" }}
                        minRows={4}
                        {...form.getInputProps("content")}
                    />
                    <Button
                        maw={180}
                        color="gray"
                        size="sm"
                        onClick={() => handleSendMail(form.values)}
                        disabled={
                            !form.values.name ||
                            !form.values.email ||
                            !form.values.content
                        }
                    >
                        {loading ? (
                            <IconLoader className={loading ? "spinner" : ""} />
                        ) : (
                            "Send message"
                        )}
                    </Button>
                </Stack>
            </Flex>
        </Stack>
    );
};

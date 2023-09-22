import {
    TextInput,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    LoadingOverlay,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { IconAt, IconChevronLeft, IconMail } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";

import { authService } from "../../services/auth.service";

export const ForgotPassword = () => {
    const [counter, setCounter] = useState(0);
    const [loading, setLoading] = useState(false);
    const form = useForm({
        initialValues: {
            email: "",
            token: "",
        },

        validateInputOnBlur: true,

        validate: {
            email: isEmail("Email không được để trống"),
            token: hasLength(
                { min: 6, max: 20 },
                "Mã xác nhận không được để trống"
            ),
        },
    });

    const handleError = (errors: typeof form.errors): void => {
        if (errors.password) {
            showNotification({
                message: "Pass word incorrect",
                color: "red",
            });
        } else if (errors.email) {
            showNotification({
                message: "Please provide a valid email",
                color: "red",
            });
        }
    };

    const handleSubmit = (values: typeof form.values): void => {
        handleValidate(values);
    };

    const handleGetToken = async () => {
        // const res = await getToken
        console.log(!form.values.email && !form.values.token);
        setCounter(60);
    };

    useEffect(() => {
        let timer: number;
        if (counter > 0)
            timer = setInterval(() => setCounter(counter - 1), 1000);

        return () => clearInterval(timer);
    }, [counter]);

    return (
        <>
            <Link to="/login">
                <Group spacing={0}>
                    <IconChevronLeft />
                    <Text color="gray">Quay về </Text>
                </Group>
            </Link>
            <Center>
                <Container w={400} my={40}>
                    <Title
                        align="center"
                        sx={(theme) => ({
                            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                            fontWeight: 900,
                        })}
                    >
                        PERFUME & LDA!
                    </Title>
                    <Text color="dimmed" size={30} align="center" mt={5}>
                        Lấy lại mật khẩu
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Email"
                                placeholder="Nhập địa chỉ email"
                                icon={<IconMail size={16} />}
                                required
                                {...form.getInputProps("email")}
                            />
                            <div
                                style={{
                                    position: "relative",
                                }}
                            >
                                <TextInput
                                    mt={10}
                                    placeholder="Nhập mã xác nhận"
                                    icon={<IconAt size={16} />}
                                    required
                                    {...form.getInputProps("token")}
                                />
                                <Button
                                    style={{
                                        position: "absolute",
                                        right: "0",
                                        top: "0",
                                    }}
                                    onClick={() => handleGetToken()}
                                    disabled={counter > 0}
                                >
                                    {counter > 0
                                        ? "Gửi lại mã " + counter
                                        : "Gửi mã"}
                                </Button>
                            </div>

                            <Button
                                fullWidth
                                mt="xl"
                                type="submit"
                                disabled={
                                    !form.values.email || !form.values.token
                                }
                            >
                                Xác nhận
                            </Button>
                            <LoadingOverlay
                                sx={{ position: "fixed", height: "100%" }}
                                loaderProps={{
                                    size: "sm",
                                    color: "pink",
                                    variant: "oval",
                                }}
                                overlayOpacity={0.3}
                                overlayColor="#c5c5c5"
                                visible={loading}
                            />
                        </form>
                    </Paper>
                </Container>
            </Center>
        </>
    );
};

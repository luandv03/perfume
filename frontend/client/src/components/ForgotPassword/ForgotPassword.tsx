import {
    TextInput,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import {
    IconAt,
    IconChevronLeft,
    IconMail,
    IconLoader,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";

import { authService } from "../../services/auth.service";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
    const [counter, setCounter] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const form = useForm({
        initialValues: {
            email: "",
            otp: "",
        },

        // validateInputOnBlur: true,

        validate: {
            email: isEmail("Email không được để trống"),
            otp: hasLength(
                { min: 1, max: 20 },
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
        handleConfirmOtp(values);
    };

    const handleGetToken = async () => {
        if (!form.values.email) {
            return;
        }
        setLoading(true);
        const res = await authService.sendOtpToEmail(form.values.email);
        setLoading(false);
        setCounter(60);

        if (res.statusCode !== 200)
            showNotification({
                message: res.message,
            });
    };

    const handleConfirmOtp = async ({
        email,
        otp,
    }: {
        email: string;
        otp: string;
    }) => {
        setLoadingConfirm(true);
        const res = await authService.confirmOtpAndSendNewPassword(email, otp);
        setLoadingConfirm(false);

        if (res.statusCode !== 200)
            return showNotification({
                message: res.response.data.message,
            });

        showNotification({
            title: res.message,
            message: "Chúng tôi đã gửi mật khẩu mới đến email của bạn",
        });
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
                <Container w={400} my={40} px={10}>
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
                                    {...form.getInputProps("otp")}
                                />
                                <Button
                                    style={{
                                        position: "absolute",
                                        right: "2px",
                                        top: "2px",
                                        border: "0",
                                    }}
                                    h={32}
                                    onClick={() => handleGetToken()}
                                    disabled={
                                        counter > 0 ||
                                        !form.values.email ||
                                        loading
                                    }
                                >
                                    {loading && (
                                        <IconLoader
                                            className={loading ? "spinner" : ""}
                                        />
                                    )}
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
                                    !form.values.email ||
                                    !form.values.otp ||
                                    loadingConfirm
                                }
                            >
                                {loadingConfirm ? (
                                    <IconLoader
                                        className={
                                            loadingConfirm ? "spinner" : ""
                                        }
                                    />
                                ) : (
                                    "Xác nhận"
                                )}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Center>
        </>
    );
};

import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    LoadingOverlay,
    Flex,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
    IconCheck,
    IconX,
    IconAt,
    IconLock,
    IconChevronLeft,
    IconBrandFacebook,
    IconBrandGoogle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { authService } from "../../services/auth.service";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";

export function LoginAuth() {
    const [loading, setLoading] = useState(false);
    const [isOAuth, setIsOAuth] = useState({
        status: false,
        method: "",
    });

    const { setProfile } = useContext(AuthContext);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validateInputOnBlur: true,

        validate: {
            email: isEmail("Invalid email"),
            password: hasLength(
                { min: 8, max: 20 },
                "Value must have 8 or more characters"
            ),
        },
    });

    const navigate = useNavigate();

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
        setIsOAuth((prev: { status: boolean; method: string }) => ({
            ...prev,
            status: false,
        }));

        handleValidate(values);
    };

    const handleValidate = async (values: typeof form.values) => {
        try {
            setLoading(true);
            await authService.login(values);
            setLoading(false);
            showNotification({
                message: "You login successfully!",
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });
            const response = await authService.getProfile();
            setProfile(response.data);
            localStorage.setItem("isAuthenticated", "true");
            navigate("/");
            form.reset();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showNotification({
                title: "Login failure!",
                message: error.response.data.message,
                color: "red",
                icon: <IconX />,
                autoClose: 3000,
            });
            setLoading(false);
        }
    };

    const handleLoginWithGoogle = () => {
        setIsOAuth((prev: { status: boolean; method: string }) => ({
            ...prev,
            status: false,
        }));

        let timer: ReturnType<typeof setTimeout> | null = null;
        const newWindow = window.open(
            "http://localhost:8888/api/v1/auth/google/login",
            "_blank",
            "width=500, height=600"
        );

        if (newWindow) {
            timer = setInterval(() => {
                if (newWindow.closed) {
                    JSON.parse(
                        localStorage.getItem("isAuthenticated") as string
                    )
                        ? navigate("/")
                        : setIsOAuth({
                              method: "Google",
                              status: true,
                          });

                    if (timer) clearInterval(timer);
                }
            }, 500);
        }
    };

    const handleLoginWithFacebook = () => {
        setIsOAuth((prev: { status: boolean; method: string }) => ({
            ...prev,
            status: false,
        }));

        let timer: ReturnType<typeof setTimeout> | null = null;
        const newWindow = window.open(
            "http://localhost:8888/api/v1/auth/facebook/login",
            "_blank",
            "width=500, height=600"
        );

        if (newWindow) {
            timer = setInterval(() => {
                if (newWindow.closed) {
                    JSON.parse(
                        localStorage.getItem("isAuthenticated") as string
                    )
                        ? navigate("/")
                        : setIsOAuth({
                              method: "Facebook",
                              status: true,
                          });

                    if (timer) clearInterval(timer);
                }
            }, 500);
        }
    };

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("isAuthenticated") as string))
            navigate(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <LoadingOverlay
                visible={loading}
                overlayBlur={0.1}
                transitionDuration={200}
            />
            <Link to="/">
                <Group spacing={0}>
                    <IconChevronLeft />
                    <Text color="gray">Quay về trang chủ</Text>
                </Group>
            </Link>
            <Center>
                <Container size={420} my={40}>
                    <Title
                        align="center"
                        sx={(theme) => ({
                            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                            fontWeight: 900,
                        })}
                    >
                        PERFUME & LDA!
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Do not have an account yet?{" "}
                        <Anchor<"a"> href="/auth/register" size="sm">
                            Create account
                        </Anchor>
                    </Text>

                    <Flex style={{ width: "100%" }} justify="center" gap="md">
                        <Group>
                            {/* <form
                                action="http://localhost:4000/api/v1/auth/facebook/login"
                                method="get"
                            >
                                <Button type="submit">
                                    <IconBrandFacebook />
                                    &nbsp;
                                    <Text>FACEBOOK</Text>
                                </Button>
                            </form> */}

                            <Button onClick={() => handleLoginWithFacebook()}>
                                <IconBrandFacebook />
                                &nbsp;
                                <Text>FACEBOOK</Text>
                            </Button>
                        </Group>

                        <Group>
                            {/* <form
                                action="http://localhost:4000/api/v1/auth/google/login"
                                method="get"
                            >
                                <Button color="red" type="submit">
                                    <IconBrandGoogle />
                                    &nbsp;
                                    <Text>GOOGLE</Text>
                                </Button>
                            </form> */}

                            <Button
                                color="red"
                                onClick={() => handleLoginWithGoogle()}
                            >
                                <IconBrandGoogle />
                                &nbsp;
                                <Text>GOOGLE</Text>
                            </Button>
                        </Group>
                    </Flex>
                    <Flex mt={8}>
                        {isOAuth.status && (
                            <span style={{ color: "red" }}>
                                Email này đã được sử dụng cho 1 hình thức đăng
                                nhập khác {isOAuth.method}
                            </span>
                        )}
                    </Flex>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Email"
                                placeholder="lda@gmail.com"
                                icon={<IconAt size={16} />}
                                required
                                {...form.getInputProps("email")}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                icon={<IconLock size={16} />}
                                required
                                mt="md"
                                {...form.getInputProps("password")}
                            />
                            <Group position="apart" mt="lg">
                                <Checkbox
                                    label="Remember me"
                                    sx={{ lineHeight: 1 }}
                                />
                                <Anchor<"a">
                                    onClick={(event) => event.preventDefault()}
                                    href="#"
                                    size="sm"
                                >
                                    Forgot password?
                                </Anchor>
                            </Group>
                            <Button fullWidth mt="xl" type="submit">
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Center>
        </>
    );
}

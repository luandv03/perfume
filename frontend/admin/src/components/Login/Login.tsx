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
} from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
    IconCheck,
    IconX,
    IconAt,
    IconLock,
    IconChevronLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { authService } from "../../services/auth.service";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";

export function Login() {
    const [loading, setLoading] = useState(false);

    const { setProfile } = useContext(AuthContext);

    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },

        validateInputOnBlur: true,

        validate: {
            username: hasLength(
                { min: 8, max: 20 },
                "Value must have 8 or more characters"
            ),
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
        } else if (errors.username) {
            showNotification({
                message: "Please provide a valid email",
                color: "red",
            });
        }
    };

    const handleSubmit = (values: typeof form.values): void => {
        handleValidate(values);
    };

    const handleValidate = async (values: typeof form.values) => {
        try {
            setLoading(true);
            const res = await authService.login(values);
            setLoading(false);

            if (res.statusCode !== 200) {
                return showNotification({
                    title: "You login failed!",
                    message: res.message,
                    color: "red",
                    icon: <IconX />,
                    autoClose: 3000,
                });
            }
            showNotification({
                message: "You login successfully!",
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });
            const response = await authService.getProfile();
            setProfile(response.data);
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

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("isAuthenticated") as string))
            navigate("/");
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

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Username"
                                placeholder="username"
                                icon={<IconAt size={16} />}
                                required
                                {...form.getInputProps("username")}
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

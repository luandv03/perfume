import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    LoadingOverlay,
    Menu,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
    IconCheck,
    IconX,
    IconAt,
    IconMail,
    IconLock,
    IconChevronLeft,
    IconCalendarDue,
    IconPhoneCall,
    IconHome2,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { authService } from "../../services/auth.service";

export function Register() {
    const [value, setValue] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            fullname: "",
            password: "",
            phone_number: "",
            address: "",
            email: "",
            dob: "",
        },

        validateInputOnBlur: true,

        validate: {
            fullname: hasLength({ min: 1 }, "Không được để trống"),
            phone_number: hasLength({ min: 1 }, "Không được để trống"),
            address: hasLength({ min: 1 }, "Không được để trống"),
            dob: hasLength({ min: 1 }, "Không được để trống"),
            email: isEmail("Email không hợp lệ"),
            password: hasLength(
                { min: 8, max: 30 },
                "Mật khẩu phải có tối thiểu 8 hoặc tối đa 30 ký tự"
            ),
        },
    });

    function convertDateToDob(str: string) {
        const date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

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

    const handleValidate = async (values: typeof form.values) => {
        try {
            setLoading(true);
            const res = await authService.register(values);
            setLoading(false);
            if (res.statusCode === 200) {
                form.reset();

                showNotification({
                    message: "You register successfully!",
                    color: "yellow",
                    icon: <IconCheck />,
                    autoClose: 3000,
                });

                return navigate("/login");
            }

            return showNotification({
                title: "You register failed!",
                message: res.message,
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showNotification({
                title: "Resgister failure!",
                message: error.response.data.message,
                color: "red",
                icon: <IconX />,
                autoClose: 3000,
            });
            setLoading(false);
        }
    };

    return (
        <>
            <Link to="/">
                <Group spacing={0}>
                    <IconChevronLeft />
                    <Text color="gray">Go back home</Text>
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
                        Do you have account?{" "}
                        <Link to="/login" style={{ color: "blue" }}>
                            SignIn
                        </Link>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Fullname"
                                placeholder="Nguyễn Văn A"
                                icon={<IconAt size={16} />}
                                required
                                {...form.getInputProps("fullname")}
                            />
                            <TextInput
                                label="Phone Number"
                                placeholder="012345678"
                                icon={<IconPhoneCall size={16} />}
                                required
                                {...form.getInputProps("phone_number")}
                            />
                            <TextInput
                                label="Address"
                                placeholder="Số 1 Đại Cồ Việt"
                                icon={<IconHome2 size={16} />}
                                required
                                {...form.getInputProps("address")}
                            />

                            <Menu opened={opened} onChange={setOpened}>
                                <Menu.Target>
                                    <TextInput
                                        label="Birthday"
                                        placeholder="28/08/2003"
                                        icon={<IconCalendarDue size={16} />}
                                        required
                                        {...form.getInputProps("dob")}
                                    />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Group position="center">
                                        <DatePicker
                                            hideWeekdays
                                            value={value}
                                            onChange={(e) => {
                                                setValue(e);
                                                form.setValues({
                                                    ...form.values,
                                                    dob: `${convertDateToDob(
                                                        e
                                                    )}`,
                                                });
                                            }}
                                        />
                                    </Group>
                                </Menu.Dropdown>
                            </Menu>

                            <TextInput
                                label="Email"
                                placeholder="lda@gmail.com"
                                icon={<IconMail size={16} />}
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

                            <Button
                                fullWidth
                                mt="xl"
                                type="submit"
                                disabled={loading}
                            >
                                SignUp
                            </Button>
                        </form>
                    </Paper>
                </Container>
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
            </Center>
        </>
    );
}

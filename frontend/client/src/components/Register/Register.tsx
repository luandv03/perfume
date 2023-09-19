import {
    TextInput,
    PasswordInput,
    Anchor,
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
import { Link } from "react-router-dom";
import { useState } from "react";

import { authService } from "../../services/auth.service";

export function Register() {
    const [value, setValue] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);

    console.log(value);

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
            email: isEmail("Invalid email"),
            password: hasLength(
                { min: 8, max: 20 },
                "Value must have 8 or more characters"
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
                return showNotification({
                    message: "You register successfully!",
                    color: "yellow",
                    icon: <IconCheck />,
                    autoClose: 3000,
                });
            }

            return showNotification({
                title: "You register failed!",
                message: res.message,
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });

            form.reset();
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
                        Bạn đã có tài khoản chưa?{" "}
                        <Link to="/login" style={{ color: "blue" }}>
                            Đăng nhập
                        </Link>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Họ và tên"
                                placeholder="Nguyễn Văn A"
                                icon={<IconAt size={16} />}
                                required
                                {...form.getInputProps("fullname")}
                            />
                            <TextInput
                                label="Số điện thoại"
                                placeholder="012345678"
                                icon={<IconPhoneCall size={16} />}
                                required
                                {...form.getInputProps("phone_number")}
                            />
                            <TextInput
                                label="Địa chỉ"
                                placeholder="Số 1 Đại Cồ Việt"
                                icon={<IconHome2 size={16} />}
                                required
                                {...form.getInputProps("address")}
                            />

                            <Menu
                                // form.setValues({
                                //     ...form.values,
                                //     dob: `${value}`,
                                // });
                                opened={opened}
                                onChange={setOpened}
                            >
                                <Menu.Target>
                                    <TextInput
                                        label="Ngày sinh"
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
                            <Group position="apart" mt="lg">
                                <Anchor<"a">
                                    onClick={(event) => event.preventDefault()}
                                    href="#"
                                    size="sm"
                                >
                                    Quên mật khẩu
                                </Anchor>
                            </Group>
                            <Button
                                fullWidth
                                mt="xl"
                                type="submit"
                                disabled={loading}
                            >
                                Đăng ký
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

import { Stack, Text, PasswordInput, Button } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IconLock, IconLoader } from "@tabler/icons-react";

import { authService } from "../../services/auth.service";

export const ResetPassword = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },

        validate: {
            password: hasLength(
                { min: 8 },
                "Mật khẩu phải có tối thiểu 8 ký tự"
            ),
            newPassword: hasLength(
                { min: 8 },
                "Mật khẩu phải có tối thiểu 8 ký tự"
            ),
            confirmNewPassword: (value, values) =>
                value !== values.newPassword ? "Passwords did not match" : null,
        },
    });

    const handleError = (errors: typeof form.errors): void => {
        if (errors.password || errors.newPassword) {
            notifications.show({
                message: "Password incorrect",
                color: "red",
            });
        }
    };

    const handleSubmit = (values: typeof form.values): void => {
        handleResetPassword(
            values.password,
            values.newPassword,
            values.confirmNewPassword
        );
    };

    const handleResetPassword = async (
        password: string,
        newPassword: string,
        confirmNewPassword: string
    ) => {
        setLoading(true);
        const res = await authService.resetPassword(
            password,
            newPassword,
            confirmNewPassword
        );
        setLoading(false);

        notifications.show({
            title: res.statusCode,
            message: res.message,
        });
    };

    return (
        <Stack>
            <Text size={26} fw={600}>
                Reset Password
            </Text>

            <Text>Your password must contain at least 8 characters</Text>

            <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                <Stack>
                    <PasswordInput
                        label={form.values.password && "Current Password"}
                        placeholder="Current Password"
                        withAsterisk
                        miw={300}
                        {...form.getInputProps("password")}
                        icon={<IconLock size={16} />}
                    />

                    <PasswordInput
                        label={form.values.newPassword && "New Password"}
                        placeholder="New Password"
                        withAsterisk
                        miw={300}
                        {...form.getInputProps("newPassword")}
                        icon={<IconLock size={16} />}
                    />
                    <PasswordInput
                        label={
                            form.values.confirmNewPassword &&
                            "Confirm New Password"
                        }
                        placeholder="Confirm New Password"
                        withAsterisk
                        miw={300}
                        {...form.getInputProps("confirmNewPassword")}
                        icon={<IconLock size={16} />}
                    />
                    <Button
                        type="submit"
                        disabled={
                            loading ||
                            !form.values.password ||
                            !form.values.newPassword ||
                            !form.values.confirmNewPassword
                        }
                    >
                        {loading ? (
                            <IconLoader className={loading ? "spinner" : ""} />
                        ) : (
                            "Reset"
                        )}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
};

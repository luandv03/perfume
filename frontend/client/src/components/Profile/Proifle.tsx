import { Text, Group, Stack, TextInput, Button, Menu } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconLoader, IconCalendarDue } from "@tabler/icons-react";
import { useState } from "react";
import { useContext } from "react";

import { authService } from "../../services/auth.service";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { handleOrderDate } from "../../helpers/handleOrderDate.helper";

export function Profile() {
    const { profile, setProfile } = useContext(AuthContext);
    const [updateProfile, setUpdateProfile] = useState(profile);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(null);
    const [opened, setOpened] = useState(false);

    const handleUpdateProfile = async () => {
        setLoading(true);
        const res = await authService.updateProfile({
            fullname: updateProfile.fullname,
            phone_number: updateProfile.phone_number,
            dob: updateProfile.dob,
            address: updateProfile.address,
        });
        setLoading(false);

        if (res.statusCode === 200) {
            setUpdateProfile((prev) => ({
                ...prev,
                fullname: res.data.fullname,
                phone_number: res.data.phone_number,
                address: res.data.address,
                dob: res.data.dob,
            }));

            setProfile((prev) => ({
                ...prev,
                fullname: res.data.fullname,
                phone_number: res.data.phone_number,
                address: res.data.address,
                dob: res.data.dob,
            }));
        }
    };

    function convertDateToDob(str: string) {
        const date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    return (
        <Stack>
            <Text size={20}>Profile</Text>
            <Group>
                <Text size="16px" fw={500}>
                    Email:
                </Text>
                <Text fw={500} color="gray">
                    {profile.email}
                </Text>
            </Group>

            <TextInput
                label="Fullname"
                withAsterisk
                maw={400}
                value={updateProfile.fullname}
                onChange={(e) =>
                    setUpdateProfile((prev) => {
                        return {
                            ...prev,
                            fullname: e.target.value,
                        };
                    })
                }
            />
            <TextInput
                label="Addess"
                withAsterisk
                maw={400}
                value={updateProfile.address}
                onChange={(e) =>
                    setUpdateProfile((prev) => {
                        return {
                            ...prev,
                            address: e.target.value,
                        };
                    })
                }
            />
            <TextInput
                label="PhoneNumber"
                withAsterisk
                maw={400}
                value={updateProfile.phone_number}
                onChange={(e) =>
                    setUpdateProfile((prev) => {
                        return {
                            ...prev,
                            phone_number: e.target.value,
                        };
                    })
                }
            />

            <Menu opened={opened} onChange={setOpened}>
                <Menu.Target>
                    <TextInput
                        label="Birthday"
                        icon={<IconCalendarDue size={16} />}
                        value={handleOrderDate(updateProfile.dob)}
                        required
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <Group position="center">
                        <DatePicker
                            hideWeekdays
                            value={value}
                            onChange={(e) => {
                                setValue(e);
                                setUpdateProfile((prev) => {
                                    return {
                                        ...prev,
                                        dob: `${convertDateToDob(e)}`,
                                    };
                                });
                            }}
                        />
                    </Group>
                </Menu.Dropdown>
            </Menu>

            <Button
                onClick={() => handleUpdateProfile()}
                disabled={
                    JSON.stringify(profile) === JSON.stringify(updateProfile)
                }
            >
                {loading ? (
                    <IconLoader className={loading ? "spinner" : ""} />
                ) : (
                    "Update"
                )}
            </Button>
        </Stack>
    );
}

import { Text, Group, Stack, TextInput, Button } from "@mantine/core";
import { IconLoader } from "@tabler/icons-react";
import { useState } from "react";
import { useContext } from "react";

import { authService } from "../../services/auth.service";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { handleOrderDate } from "../../helpers/handleOrderDate.helper";

export function Profile() {
    const { profile, setProfile } = useContext(AuthContext);
    const [updateProfile, setUpdateProfile] = useState(profile);
    const [loading, setLoading] = useState<boolean>(false);

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
            <TextInput
                label="Birthday"
                withAsterisk
                maw={400}
                value={handleOrderDate(updateProfile.dob)}
                onChange={(e) =>
                    setUpdateProfile((prev) => {
                        return {
                            ...prev,
                            dob: e.target.value,
                        };
                    })
                }
            />

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

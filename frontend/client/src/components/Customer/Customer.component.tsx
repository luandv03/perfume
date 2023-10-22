import { Flex, Stack, Text } from "@mantine/core";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../providers/AuthProvider/AuthProvider";

export default function Customer() {
    const location = useLocation();

    const { profile } = useContext(AuthContext);

    return (
        <div style={{ width: "100%" }}>
            <Flex
                sx={{
                    width: "100%",
                    "@media (max-width: 64em)": {
                        flexDirection: "column",
                    },
                }}
            >
                <Stack sx={{ height: "100%" }}>
                    <Text size={20}>My Account</Text>
                    <Link to="/customer">
                        <Text
                            color={
                                location.pathname === "/customer"
                                    ? "red"
                                    : "black"
                            }
                        >
                            Profile
                        </Text>
                    </Link>

                    <Link to="/customer/order">
                        <Text
                            color={
                                location.pathname.includes("order")
                                    ? "red"
                                    : "black"
                            }
                        >
                            My Order
                        </Text>
                    </Link>

                    {profile.auth_method === "system" && (
                        <Link to="/customer/reset_password">
                            <Text
                                color={
                                    location.pathname ===
                                    "/customer/reset_password"
                                        ? "red"
                                        : "black"
                                }
                            >
                                Reset Password
                            </Text>
                        </Link>
                    )}
                </Stack>
                <Flex
                    sx={{
                        paddingLeft: "20px",
                        "@media (max-width: 64em)": {
                            flexDirection: "column",
                            paddingLeft: 0,
                        },
                    }}
                >
                    <Outlet />
                </Flex>
            </Flex>
        </div>
    );
}

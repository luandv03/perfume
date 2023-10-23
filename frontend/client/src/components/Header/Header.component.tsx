import {
    createStyles,
    Header,
    Group,
    Button,
    Text,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
    HoverCard,
    Stack,
    TextInput,
    Divider,
    Badge,
    Flex,
    LoadingOverlay,
    Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    IconChevronDown,
    IconShoppingCart,
    IconSearch,
} from "@tabler/icons-react";
import { useState, useEffect, useContext, KeyboardEvent } from "react";

import { CategoryType } from "../../types/category.type";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { categoryService } from "../../services/category.service";
import { authService } from "../../services/auth.service";
import { getItemLocalStorage } from "../../helpers/handleLocalStorage.helper";
import { CartItem } from "../Cart/Cart";

const useStyles = createStyles((theme) => ({
    link: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,

        [theme.fn.smallerThan("sm")]: {
            height: rem(42),
            display: "flex",
            alignItems: "center",
            width: "100%",
        },

        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        }),
    },

    subLink: {
        width: "100%",
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
        }),

        "&:active": theme.activeStyles,
    },

    dropdownFooter: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
        margin: `calc(${theme.spacing.md} * -1)`,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
        paddingBottom: theme.spacing.xl,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[1]
        }`,
    },

    hiddenMobile: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    hover: {
        "&:hover": {
            opacity: 0.9,
        },
    },
}));

export function HeaderApp() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const [dropdown, { toggle: toggleDropdown }] = useDisclosure(false);
    const { classes, theme } = useStyles();
    const { cartUser, setCartUser } = useContext(CartContext);
    const { profile, setProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);

    const [categories, setCategories] = useState<CategoryType[]>([
        {
            category_id: 0,
            category_name: "",
        },
    ]);

    // const [brands, setBrands] = useState<[{ brand: string }]>([{ brand: "" }]);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleGetAllCategories = async () => {
        const resCategories = await categoryService.getAllCategory();

        setCategories(resCategories.data);
    };

    const handleLogout = async () => {
        setLoading(true);
        const res = await authService.logout();
        setLoading(false);
        if (res.statusCode === 200) {
            localStorage.removeItem("access_token_user");
            localStorage.removeItem("refresh_token_user");

            setProfile({
                customer_id: 0,
                email: "",
                fullname: "",
                address: "",
                phone_number: "",
                dob: "",
            });
            setCartUser(getItemLocalStorage("cart"));

            localStorage.removeItem("isAuthenticated");

            notifications.show({
                message: res.message,
            });
        }
    };

    const handleSearch = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            !!searchValue && navigate("/search?title=" + searchValue);
        }
    };

    useEffect(() => {
        handleGetAllCategories();
    }, []);

    return (
        <Box>
            <Header
                height={80}
                px="50px"
                sx={{
                    background: "rgb(97 42 42)",
                    "@media (max-width: 48em)": {
                        padding: "0 10px",
                    },
                }}
            >
                <Group position="apart" sx={{ height: "100%" }}>
                    <TextInput
                        placeholder="Product name...."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearch}
                        rightSection={<IconSearch size="18px" color="gray" />}
                    />

                    <Text
                        sx={{
                            "@media (max-width: 48em)": {
                                display: "none",
                            },
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <Text
                                size={24}
                                fw={700}
                                c="white"
                                sx={{
                                    fontFamily: "Alumni Sans Collegiate One",
                                }}
                            >
                                PERFUME&LDA
                            </Text>
                        </Link>
                    </Text>

                    <Group className={classes.hiddenMobile} spacing={15}>
                        <Stack sx={{ height: "100%" }} spacing={0}>
                            <Text color="white">
                                Welcome,{" "}
                                {profile?.customer_id
                                    ? profile.fullname
                                    : "Guest"}
                            </Text>
                            {profile?.customer_id ? (
                                <Group>
                                    <NavLink
                                        to="/customer"
                                        style={{ textDecoration: "none" }}
                                        className={({ isActive, isPending }) =>
                                            isPending
                                                ? "pending"
                                                : isActive
                                                ? "active"
                                                : "normal"
                                        }
                                    >
                                        <Text color="white" fw={500}>
                                            Account
                                        </Text>
                                    </NavLink>
                                    <span style={{ color: "white" }}>|</span>
                                    <Button
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                    >
                                        <Text color="white" fw={500}>
                                            Logout
                                        </Text>
                                    </Button>
                                </Group>
                            ) : (
                                <Group>
                                    <Link
                                        to="/login"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Text color="white" fw={500}>
                                            SignIn
                                        </Text>
                                    </Link>
                                    <span style={{ color: "white" }}>|</span>
                                    <Link
                                        to="/register"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Text color="white" fw={500}>
                                            SignUp
                                        </Text>
                                    </Link>
                                </Group>
                            )}
                        </Stack>
                        <Divider orientation="vertical" size="sm" />
                        <Link to="/cart" style={{ position: "relative" }}>
                            <IconShoppingCart color="white" />
                            <Badge
                                size="sm"
                                sx={{
                                    position: "absolute",
                                    right: "-10px",
                                    top: "-6px",
                                }}
                            >
                                {cartUser.length > 0
                                    ? cartUser.reduce(
                                          (acc: number, curr: CartItem) =>
                                              acc + curr.quantity,
                                          0
                                      )
                                    : 0}
                            </Badge>
                        </Link>
                    </Group>
                    <Group
                        align="center"
                        sx={{
                            "@media (min-width: 48em)": {
                                display: "none",
                            },
                        }}
                    >
                        <Link to="/cart" style={{ position: "relative" }}>
                            <IconShoppingCart color="white" />
                            <Badge
                                size="sm"
                                sx={{
                                    position: "absolute",
                                    right: "-10px",
                                    top: "-6px",
                                }}
                            >
                                {cartUser.length > 0
                                    ? cartUser.reduce(
                                          (acc: number, curr: CartItem) =>
                                              acc + curr.quantity,
                                          0
                                      )
                                    : 0}
                            </Badge>
                        </Link>
                        <Burger
                            opened={drawerOpened}
                            onClick={toggleDrawer}
                            className={classes.hiddenDesktop}
                            color="white"
                        />
                    </Group>
                </Group>
                <Group
                    position="center"
                    spacing={20}
                    sx={{
                        "@media (max-width: 48em)": {
                            display: "none",
                        },
                    }}
                >
                    <NavLink
                        to="/"
                        style={{
                            textDecoration: "none",
                        }}
                        className={({ isActive, isPending }) =>
                            isPending
                                ? "pending"
                                : isActive
                                ? "active"
                                : "normal"
                        }
                    >
                        <Text
                            size="20px"
                            fw={500}
                            color="inherit"
                            sx={{ "&:hover": { color: "rgb(125 45 45)" } }}
                        >
                            Home
                        </Text>
                    </NavLink>
                    <NavLink
                        to="/about"
                        style={{ textDecoration: "none" }}
                        className={({ isActive, isPending }) =>
                            isPending
                                ? "pending"
                                : isActive
                                ? "active"
                                : "normal"
                        }
                    >
                        <Text
                            size="20px"
                            fw={500}
                            color="inherit"
                            sx={{ "&:hover": { color: "rgb(125 45 45)" } }}
                        >
                            About
                        </Text>
                    </NavLink>
                    <HoverCard width={200} shadow="md">
                        <HoverCard.Target>
                            <Flex gap={0} align="center">
                                <Text
                                    size="20px"
                                    fw={500}
                                    color="black"
                                    sx={{
                                        "&:hover": { color: "rgb(125 45 45)" },
                                    }}
                                >
                                    Category
                                </Text>
                                <Flex
                                    style={{
                                        height: "31px",
                                    }}
                                    align="center"
                                >
                                    <IconChevronDown height={31} stroke={1} />
                                </Flex>
                            </Flex>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Stack>
                                {categories?.length > 0 &&
                                    categories.map((category: CategoryType) => (
                                        <NavLink
                                            to={`/product/${category.category_id}/filter`}
                                            state={{
                                                category_name:
                                                    category.category_name,
                                            }}
                                            style={{
                                                textDecoration: "none",
                                                borderBottom: "1px solid gray",
                                            }}
                                            className={({
                                                isActive,
                                                isPending,
                                            }) =>
                                                isPending
                                                    ? "pending"
                                                    : isActive
                                                    ? "active"
                                                    : "normal"
                                            }
                                            key={category.category_id}
                                        >
                                            <Text color="black">
                                                {category.category_name}
                                            </Text>
                                        </NavLink>
                                    ))}
                            </Stack>
                        </HoverCard.Dropdown>
                    </HoverCard>

                    <NavLink
                        to="/contact"
                        style={{ textDecoration: "none" }}
                        className={({ isActive, isPending }) =>
                            isPending
                                ? "pending"
                                : isActive
                                ? "active"
                                : "normal"
                        }
                    >
                        <Text
                            size="20px"
                            fw={500}
                            color="inherit"
                            sx={{ "&:hover": { color: "rgb(125 45 45)" } }}
                        >
                            Contact
                        </Text>
                    </NavLink>
                </Group>
            </Header>

            {/* Mobile */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="60%"
                padding="md"
                className={classes.hiddenDesktop}
                zIndex={1000000}
            >
                <ScrollArea
                    h={`calc(100vh - ${rem(60)})`}
                    mx="-md"
                    type="never"
                    scrollbarSize={8}
                    scrollHideDelay={2500}
                >
                    <Stack
                        py={10}
                        sx={{ background: "rgb(97 42 42)" }}
                        spacing={0}
                        align="center"
                    >
                        <Text color="white">
                            Welcome,{" "}
                            {profile?.customer_id ? profile.fullname : "Guest"}
                        </Text>
                        {profile?.customer_id ? (
                            <Group>
                                <NavLink
                                    to="/customer"
                                    style={{ textDecoration: "none" }}
                                    onClick={() => closeDrawer()}
                                >
                                    <Text color="white" fw={500}>
                                        Account
                                    </Text>
                                </NavLink>
                                <span style={{ color: "white" }}>|</span>
                                <Button
                                    onClick={() => {
                                        closeDrawer();
                                        handleLogout();
                                    }}
                                >
                                    <Text color="white" fw={500}>
                                        Logout
                                    </Text>
                                </Button>
                            </Group>
                        ) : (
                            <Group>
                                <NavLink
                                    to="/login"
                                    style={{ textDecoration: "none" }}
                                    className={({ isActive, isPending }) =>
                                        isPending
                                            ? "pending"
                                            : isActive
                                            ? "active"
                                            : "normal"
                                    }
                                    onClick={() => closeDrawer()}
                                >
                                    <Text color="white" fw={500}>
                                        SignIn
                                    </Text>
                                </NavLink>
                                <span style={{ color: "white" }}>|</span>
                                <Link
                                    to="/register"
                                    style={{ textDecoration: "none" }}
                                    onClick={() => closeDrawer()}
                                >
                                    <Text color="white" fw={500}>
                                        SignUp
                                    </Text>
                                </Link>
                            </Group>
                        )}
                    </Stack>
                    <Divider
                        color={
                            theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                        }
                    />

                    <Divider
                        my="sm"
                        color={
                            theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                        }
                    />

                    <Stack pl={10}>
                        <Link
                            to="/"
                            style={{ textDecoration: "none" }}
                            className={classes.hover}
                            onClick={() => closeDrawer()}
                        >
                            <Text size="16px" fw={500} color="black">
                                Home
                            </Text>
                        </Link>
                        <Divider
                            color={
                                theme.colorScheme === "dark"
                                    ? "dark.5"
                                    : "gray.1"
                            }
                        />
                        <Link
                            to="/about"
                            style={{ textDecoration: "none" }}
                            onClick={() => closeDrawer()}
                        >
                            <Text size="16px" fw={500} color="black">
                                About
                            </Text>
                        </Link>
                        <Divider
                            color={
                                theme.colorScheme === "dark"
                                    ? "dark.5"
                                    : "gray.1"
                            }
                        />
                        <Stack>
                            <Flex
                                gap={1}
                                align="center"
                                onClick={toggleDropdown}
                            >
                                <Text size="16px" fw={500} color="black">
                                    Category
                                </Text>
                                <Flex
                                    style={{
                                        height: "31px",
                                    }}
                                    align="center"
                                >
                                    <IconChevronDown height={31} stroke={1} />
                                </Flex>
                            </Flex>

                            <Collapse in={dropdown}>
                                <Stack>
                                    {categories?.length > 0 &&
                                        categories.map(
                                            (category: CategoryType) => (
                                                <Link
                                                    to={`/product/${category.category_id}/filter`}
                                                    state={{
                                                        category_name:
                                                            category.category_name,
                                                    }}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                    key={category.category_id}
                                                    onClick={() =>
                                                        closeDrawer()
                                                    }
                                                >
                                                    <Text color="black">
                                                        {category.category_name}
                                                    </Text>

                                                    <Divider
                                                        color={
                                                            theme.colorScheme ===
                                                            "dark"
                                                                ? "dark.5"
                                                                : "gray.1"
                                                        }
                                                    />
                                                </Link>
                                            )
                                        )}
                                </Stack>
                            </Collapse>
                        </Stack>

                        <Divider
                            color={
                                theme.colorScheme === "dark"
                                    ? "dark.5"
                                    : "gray.1"
                            }
                        />
                        <Link
                            to="/contact"
                            style={{ textDecoration: "none" }}
                            onClick={() => closeDrawer()}
                        >
                            <Text size="16px" fw={500} color="black">
                                Contact
                            </Text>
                        </Link>
                        <Divider
                            color={
                                theme.colorScheme === "dark"
                                    ? "dark.5"
                                    : "gray.1"
                            }
                        />
                    </Stack>
                </ScrollArea>
            </Drawer>
            <LoadingOverlay
                sx={{ position: "fixed", height: "100%" }}
                loaderProps={{ size: "sm", color: "pink", variant: "oval" }}
                overlayOpacity={0.3}
                overlayColor="#c5c5c5"
                visible={loading}
            />
        </Box>
    );
}

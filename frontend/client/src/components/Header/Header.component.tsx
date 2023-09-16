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
    SimpleGrid,
    HoverCard,
    Stack,
    TextInput,
    Divider,
    Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
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
import { productService } from "../../services/product.service";
import { authService } from "../../services/auth.service";
import { getItemLocalStorage } from "../../helpers/handleLocalStorage.helper";

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
    const { classes, theme } = useStyles();
    const { cartUser, setCartUser } = useContext(CartContext);
    const { profile, setProfile } = useContext(AuthContext);

    const [categories, setCategories] = useState<CategoryType[]>([
        {
            category_id: 0,
            category_name: "",
        },
    ]);

    const [brands, setBrands] = useState<[{ brand: string }]>([{ brand: "" }]);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleGetAllCategories = async () => {
        const [resCategories, resBrands] = await Promise.all([
            categoryService.getAllCategory(),
            productService.getAllBrand(),
        ]);

        setCategories(resCategories.data);
        setBrands(resBrands.data);
    };

    const handleLogout = async () => {
        const res = await authService.logout();
        if (res.statusCode === 200) {
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
            navigate("/search?title=" + searchValue);
            setSearchValue("");
        }
    };

    useEffect(() => {
        handleGetAllCategories();
    }, []);

    return (
        <Box>
            <Header height={80} px="50px" sx={{ background: "rgb(97 42 42)" }}>
                <Group position="apart" sx={{ height: "100%" }}>
                    <TextInput
                        placeholder="Tên sản phẩm...."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearch}
                        rightSection={<IconSearch size="18px" color="gray" />}
                    />

                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Text size={24} fw={700} c="white">
                            PERFUME&LDA
                        </Text>
                    </Link>

                    <Group className={classes.hiddenMobile} spacing={15}>
                        <Stack sx={{ height: "100%" }} spacing={0}>
                            <Text color="white">
                                Xin chào,{" "}
                                {profile.customer_id
                                    ? profile.fullname
                                    : "Quý khách"}
                            </Text>
                            {profile.customer_id ? (
                                <Group>
                                    <Link
                                        to="/customer"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Text color="white" fw={500}>
                                            Tài khoản
                                        </Text>
                                    </Link>
                                    <span style={{ color: "white" }}>|</span>
                                    <Button onClick={() => handleLogout()}>
                                        <Text color="white" fw={500}>
                                            Đăng xuất
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
                                            Đăng nhập
                                        </Text>
                                    </Link>
                                    <span style={{ color: "white" }}>|</span>
                                    <Link
                                        to="/register"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Text color="white" fw={500}>
                                            Đăng ký
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
                                          (acc, curr) => acc + curr.quantity,
                                          0
                                      )
                                    : 0}
                            </Badge>
                        </Link>
                    </Group>

                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        className={classes.hiddenDesktop}
                    />
                </Group>
                <Group position="center" spacing={20}>
                    <Link
                        to="/"
                        style={{ textDecoration: "none" }}
                        className={classes.hover}
                    >
                        <Text size="20px" fw={500} color="black">
                            Trang chủ
                        </Text>
                    </Link>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Text size="20px" fw={500} color="black">
                            Giới thiệu
                        </Text>
                    </Link>
                    <HoverCard width={200} shadow="md">
                        <HoverCard.Target>
                            <Group>
                                <Text size="20px" fw={500} color="black">
                                    Danh mục
                                </Text>
                                <IconChevronDown />
                            </Group>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <Stack>
                                {categories.length > 0 &&
                                    categories.map((category: CategoryType) => (
                                        <Link
                                            to={`/product/${category.category_id}/filter`}
                                            state={{
                                                category_name:
                                                    category.category_name,
                                            }}
                                            style={{
                                                textDecoration: "none",
                                                borderBottom: "1px solid gray",
                                            }}
                                            key={category.category_id}
                                        >
                                            <Text color="black">
                                                {category.category_name}
                                            </Text>
                                        </Link>
                                    ))}
                            </Stack>
                        </HoverCard.Dropdown>
                    </HoverCard>

                    <HoverCard width={300} shadow="md">
                        <HoverCard.Target>
                            <Group>
                                <Text size="18px" fw={500} color="black">
                                    Thương hiệu
                                </Text>
                                <IconChevronDown />
                            </Group>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <SimpleGrid cols={3} h={100} w={300}>
                                {brands.length > 0 &&
                                    brands.map(
                                        (
                                            brand: { brand: string },
                                            index: number
                                        ) => (
                                            <Link
                                                to={`/product/${brand.brand}/filter`}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                key={index}
                                            >
                                                <Text color="black">
                                                    {brand.brand}
                                                </Text>
                                            </Link>
                                        )
                                    )}
                            </SimpleGrid>
                        </HoverCard.Dropdown>
                    </HoverCard>
                    {/* <Link to="/" style={{ textDecoration: "none" }}>
                        <Text size="20px" fw={500} color="black">
                            Blog
                        </Text>
                    </Link> */}
                </Group>
            </Header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                className={classes.hiddenDesktop}
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                    <Divider
                        my="sm"
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

                    <Group position="center" grow pb="xl" px="md">
                        <Button>Luan Dinh</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}

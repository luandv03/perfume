import { createStyles, Navbar, getStylesRef, rem } from "@mantine/core";
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconLayoutDashboard,
    IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
        }`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
        }`,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        fontSize: theme.fontSizes.sm,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,

            [`& .${getStylesRef("icon")}`]: {
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef("icon"),
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
            [`& .${getStylesRef("icon")}`]: {
                color: theme.fn.variant({
                    variant: "light",
                    color: theme.primaryColor,
                }).color,
            },
        },
    },
}));

const data = [
    { link: "/", label: "Dashboard", icon: IconLayoutDashboard },
    { link: "/category", label: "Category", icon: IconBellRinging },
    { link: "/product", label: "Product", icon: IconReceipt2 },
    { link: "/order", label: "Orders", icon: IconFingerprint },
    { link: "/post", label: "Posts", icon: IconKey },
    { link: "/feedback", label: "Feedbacks", icon: IconDatabaseImport },
    { link: "/customer", label: "Customers", icon: IconUsers },
    { link: "/admin", label: "Admins", icon: Icon2fa },
    { link: "", label: "Other Settings", icon: IconSettings },
];

export function NavbarApp() {
    const { classes, cx } = useStyles();

    const location = useLocation();

    console.log(location);

    const links = data.map((item) => (
        <Link to={item.link} style={{ textDecoration: "none" }}>
            <div
                className={cx(classes.link, {
                    [classes.linkActive]: item.link === location.pathname,
                })}
                key={item.label}
            >
                <item.icon className={classes.linkIcon} stroke={1.5} />
                <span>{item.label}</span>
            </div>
        </Link>
    ));

    return (
        <Navbar height={700} width={{ sm: 300 }} p="md">
            <Navbar.Section grow>{links}</Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                >
                    <IconSwitchHorizontal
                        className={classes.linkIcon}
                        stroke={1.5}
                    />
                    <span>Change account</span>
                </a>

                <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </Navbar.Section>
        </Navbar>
    );
}

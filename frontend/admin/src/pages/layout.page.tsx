import { createStyles } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarApp } from "../components/Navbar/Navbar.component";
import { HeaderApp } from "../components/Header/Header.component";

const useStyles = createStyles(() => ({
    wrapper: {
        display: "flex",
    },

    content: {
        padding: "20px",
        overflowX: "scroll",
    },
}));

export default function LayoutApp() {
    const { classes } = useStyles();

    return (
        <div>
            <div>
                <HeaderApp />
            </div>
            <div className={classes.wrapper}>
                <div>
                    <NavbarApp />
                </div>
                <div className={classes.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

import { createStyles } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer/Footer";

import { HeaderApp } from "../components/Header/Header.component";

const useStyles = createStyles(() => ({
    wrapper: {
        display: "flex",
    },

    content: {
        padding: "60px",
        marginTop: "20px",
        width: "100%",
        minHeight: "calc(100vh - 80px - 31px - 71px + 30px)",
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
                <div className={classes.content}>
                    <Outlet />
                </div>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
    );
}

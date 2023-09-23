import { createStyles, getBreakpointValue, em } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer/Footer";

import { HeaderApp } from "../components/Header/Header.component";

const useStyles = createStyles((theme) => ({
    wrapper: {
        display: "flex",
    },

    content: {
        padding: "40px",
        marginTop: "20px",
        width: "100%",
        minHeight: "calc(100vh - 80px - 31px - 71px + 30px)",

        [`@media (max-width: ${em(
            getBreakpointValue(theme.breakpoints.sm) - 1
        )})`]: {
            padding: "10px 10px",
        },
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

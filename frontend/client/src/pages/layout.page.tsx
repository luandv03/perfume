import { createStyles, getBreakpointValue, Button, em } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { IconArrowBigUp } from "@tabler/icons-react";

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
    const [scroll, scrollTo] = useWindowScroll();
    const { classes } = useStyles();

    const handleGoToTop = () => {
        scrollTo({ x: 0, y: 0 });
    };

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

            <Button
                bg="#0A7CFF"
                sx={{
                    position: "fixed",
                    right: "24px",
                    bottom: "100px",
                    display: scroll.y > 600 ? "flex" : "none",
                }}
                onClick={() => handleGoToTop()}
            >
                <IconArrowBigUp />
            </Button>
        </div>
    );
}

import { ScrollArea } from "@mantine/core";
import { Outlet } from "react-router-dom";

export function Product() {
    return (
        <ScrollArea sx={{ width: "100%" }}>
            <Outlet />
        </ScrollArea>
    );
}

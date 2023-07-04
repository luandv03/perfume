import { ScrollArea } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function Customer() {
    return (
        <ScrollArea sx={{ width: "100%" }}>
            <Outlet />
        </ScrollArea>
    );
}

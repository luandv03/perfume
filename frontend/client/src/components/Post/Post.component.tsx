import { ScrollArea } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function Post() {
    return (
        <ScrollArea sx={{ width: "100%" }}>
            <Outlet />
        </ScrollArea>
    );
}

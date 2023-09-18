import { Group } from "@mantine/core";
import { useLocation } from "react-router-dom";

import { FilterOption } from "../Filter";
import { FilterResult } from "./FilterResult";
import { TitlePageWrapper } from "../TitlePageWrapper/TitlePageWrapper";

export function FilterProduct() {
    const { state } = useLocation();

    return (
        <TitlePageWrapper title={state.category_name}>
            <div
                style={{
                    display: "flex",
                    height: "calc(100%-80px)",
                }}
            >
                <Group spacing={20}>
                    <div
                        style={{
                            width: "274px",
                            height: "100%",
                        }}
                    >
                        <FilterOption />
                    </div>
                    <div style={{ flex: 1 }}>
                        <FilterResult />
                    </div>
                </Group>
            </div>
        </TitlePageWrapper>
    );
}

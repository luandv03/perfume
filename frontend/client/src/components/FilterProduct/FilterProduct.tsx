import { Group } from "@mantine/core";
import { FilterOption } from "../FilterOption/FilterOption";
import { FilterResult } from "../FilterResult/FilterResult";

export function FilterProduct() {
    return (
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
    );
}

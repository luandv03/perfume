import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchBar() {
    return (
        <Input
            placeholder="Search"
            rightSection={
                <div>
                    <div>
                        <IconSearch
                            size="1.2rem"
                            style={{ display: "block", opacity: 0.5 }}
                        />
                    </div>
                </div>
            }
        />
    );
}

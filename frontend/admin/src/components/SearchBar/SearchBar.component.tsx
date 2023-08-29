// import { useState, useEffect } from "react";
import { Input } from "@mantine/core";
import { IconSearch, IconLoader2, IconX } from "@tabler/icons-react";

export function SearchBar({ value, setValue }) {
    const handleDeleteSearch = () => {
        setValue("");
    };

    return (
        <Input
            placeholder="Search"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            rightSection={
                <div>
                    <div onClick={() => handleDeleteSearch()}>
                        {value && (
                            <IconX
                                size="1.2rem"
                                style={{
                                    display: "block",
                                    opacity: 0.5,
                                    cursor: "pointer",
                                }}
                            />
                        )}
                    </div>
                </div>
            }
        />
    );
}

import {
    Stack,
    LoadingOverlay,
    // Center,
    // Text,
    // Card,
    // Image,
    // Group,
    // SimpleGrid,
    // createStyles,
} from "@mantine/core";
// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { CategoryType } from "../../types/category.type";
import { categoryService } from "../../services/category.service";
import { CharmCate } from "../CharmCate/CharmCate";

// const useStyles = createStyles(() => ({
//     hover: {
//         "&:hover": {
//             boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
//             cursor: "pointer",
//         },
//     },
// }));

export function Home() {
    // const { classes } = useStyles();

    const [categories, setCategories] = useState<CategoryType[]>([
        {
            category_id: 0,
            category_name: "",
        },
    ]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleGetAllCategories = async () => {
        setLoading(true);
        const resCategories = await categoryService.getAllCategory();

        setCategories(resCategories.data);
        setLoading(false);
    };

    useEffect(() => {
        handleGetAllCategories();
    }, []);

    return (
        <Stack sx={{ width: "100%" }}>
            {categories.length > 0 &&
                categories[0].category_id !== 0 &&
                categories.map((category: CategoryType) => (
                    <CharmCate category={category} />
                ))}
            <LoadingOverlay
                sx={{ position: "fixed", height: "100%" }}
                loaderProps={{ size: "sm", color: "pink", variant: "oval" }}
                overlayOpacity={0.3}
                overlayColor="#c5c5c5"
                visible={loading}
            />
        </Stack>
    );
}

import {
    Stack,
    Center,
    Text,
    // Card,
    // Image,
    // Group,
    // SimpleGrid,
    createStyles,
} from "@mantine/core";
import { Link } from "react-router-dom";
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

    const handleGetAllCategories = async () => {
        const resCategories = await categoryService.getAllCategory();

        setCategories(resCategories.data);
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

            <Stack p={10}>
                <Center>
                    <Link to="/blog">
                        <Text size="24px" color="black" fw={500} td="underline">
                            Thông tin
                        </Text>
                    </Link>
                </Center>

                {/* <SimpleGrid cols={4} sx={{ width: "100%" }}>
                    {[1, 2, 3, 4].map(() => (
                        <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            className={classes.hover}
                        >
                            <Card.Section>
                                <Image
                                    src="https://charmecosmetic.vn/wp-content/uploads/2022/10/charme-no-1-peace-1.jpg"
                                    height={160}
                                    alt="Norway"
                                    fit="contain"
                                />
                            </Card.Section>

                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500} lineClamp={2}>
                                    Norway Fjord Adventures
                                </Text>

                                <Text color="gray">Đã đăng: 20/8/2023</Text>

                                <Text lineClamp={3}>
                                    Lattafa Fakhar Lattafa Homme is the
                                    fragrance that opens with energizing oud
                                    fragrance with oriental notes. The fragrance
                                    has best answer to the other clones and the
                                    perfume is for women. It's the perfume you
                                    can fall in love with the first smell.
                                </Text>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid> */}
            </Stack>
        </Stack>
    );
}

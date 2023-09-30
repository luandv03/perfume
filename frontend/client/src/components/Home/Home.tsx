import { Stack, LoadingOverlay, rem, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import { CategoryType } from "../../types/category.type";
import { categoryService } from "../../services/category.service";
import { CharmCate } from "../CharmCate/CharmCate";

const prPhotos = [
    {
        photo_id: 1,
        photo_url: "/photo_3.jpg",
    },
    {
        photo_id: 2,
        photo_url: "/photo_1.jpg",
    },
    {
        photo_id: 4,
        photo_url: "/photo_5.jpg",
    },
    {
        photo_id: 5,
        photo_url: "/man.jpg",
    },
    {
        photo_id: 6,
        photo_url: "/women.avif",
    },
];

export function Home() {
    const autoplay = useRef(Autoplay({ delay: 2000 }));

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
            <Carousel
                withIndicators
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                styles={{
                    indicator: {
                        width: rem(12),
                        height: rem(4),
                        transition: "width 250ms ease",

                        "&[data-active]": {
                            width: rem(40),
                        },
                    },
                }}
            >
                {prPhotos.map((photo) => (
                    <Carousel.Slide key={photo.photo_id}>
                        <Image
                            src={photo.photo_url}
                            // height={360}
                            alt="PR"
                            fit="contain"
                            sx={{
                                border: "1px solid #f0e7e7",
                            }}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>

            {categories?.length > 0 &&
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

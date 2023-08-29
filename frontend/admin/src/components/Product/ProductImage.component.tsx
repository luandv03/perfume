import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex, Box, Image, createStyles } from "@mantine/core";
import { productService } from "../../services/product.service";

const useStyles = createStyles({
    shadowHover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            cursor: "pointer",
        },
    },
});

export function ProductImage() {
    const [photos, setPhotos] = useState([
        {
            product_photo_id: 1,
            product_photo_url: "",
        },
    ]);
    const { classes } = useStyles();
    const { product_id } = useParams();

    const handleGetPhotoProduct = async () => {
        const data = await productService.getPhotoProductById(
            Number(product_id)
        );

        setPhotos(data.data);
    };

    useEffect(() => {
        handleGetPhotoProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Flex
            style={{
                width: "100%",
            }}
            wrap="wrap"
            direction="row"
            gap="xs"
        >
            {photos.map(
                (item: {
                    product_photo_id: number;
                    product_photo_url: string;
                }) => (
                    <Box className={classes.shadowHover}>
                        <Image
                            key={item.product_photo_id}
                            width={150}
                            mx="auto"
                            radius="md"
                            src={item.product_photo_url}
                            alt="Random image"
                        />
                    </Box>
                )
            )}
        </Flex>
    );
}

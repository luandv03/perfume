import {
    Stack,
    Group,
    Image,
    Grid,
    Text,
    Button,
    NumberInput,
    Badge,
    Collapse,
    Center,
    Textarea,
    Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Carousel } from "react-responsive-carousel";

import { ProductType } from "../../types/products.type";
import { Product } from "../Product/Product";
import { ProductPhoto } from "../../types/products.type";
import { productService } from "../../services/product.service";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export function ProductDetail() {
    const [numberAddItem, setNumberAddItem] = useState<number | "">(1);
    const [opened, { toggle }] = useDisclosure(false);
    const { state } = useLocation();
    const [photos, setPhotos] = useState<ProductPhoto[]>([
        { product_photo_id: 0, product_photo_url: "" },
    ]);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product: ProductType) => {
        const { product_id, title, price, discount, brand, volume } = product;
        const cartItem = {
            product_id,
            title,
            price,
            discount,
            brand,
            volume,
            number_add_item: numberAddItem,
        };
        addToCart(cartItem);
        notifications.show({
            title: "Thành công",
            message: "Bạn đã thêm thành công sản phẩm :>",
        });
    };

    const handleGetProductPhotos = async () => {
        const resPhoto = await productService.getPhotoProductById(
            state.product.product_id,
            0,
            10
        );

        setPhotos(resPhoto.data);
    };

    useEffect(() => {
        handleGetProductPhotos();
    }, []);

    return (
        <Stack>
            <Grid
                p={10}
                sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
                gutter={2}
            >
                <Grid.Col span={4}>
                    <Stack sx={{ position: "relative" }}>
                        <Image
                            src={photos[0].product_photo_url}
                            height={300}
                            alt="Norway"
                            fit="contain"
                        />

                        <Carousel
                            showArrows={true}
                            autoPlay={true}
                            className="carousel-container"
                            // onChange={onChange}
                            // onClickItem={onClickItem}
                            // onClickThumb={onClickThumb}
                        >
                            <Image
                                src={photos[0].product_photo_url}
                                height={100}
                                alt="Norway"
                                fit="contain"
                                sx={{ border: "1px solid #f0e7e7" }}
                            />
                            <Image
                                src={photos[0].product_photo_url}
                                height={100}
                                alt="Norway"
                                fit="contain"
                                sx={{ border: "1px solid #f0e7e7" }}
                            />
                            <Image
                                src={photos[0].product_photo_url}
                                height={100}
                                alt="Norway"
                                fit="contain"
                                sx={{ border: "1px solid #f0e7e7" }}
                            />
                        </Carousel>

                        {state.product.discount > 0 && (
                            <Badge
                                color="red"
                                variant="light"
                                sx={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px",
                                }}
                            >
                                -{state.product.discount}%
                            </Badge>
                        )}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={8}>
                    <Stack spacing={10}>
                        <Text size="20px" fw={500}>
                            {state.product.title}
                        </Text>
                        <Text size="20px" fw={500}>
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                maximumFractionDigits: 9,
                            }).format(state.product.price)}
                        </Text>
                        <Text>{state.product.description}</Text>
                        <Text size="16px" fw={500}>
                            Thương hiệu
                        </Text>
                        <div>
                            <Button radius={0} compact variant="default">
                                {state.product.brand}
                            </Button>
                        </div>
                        <Text size="16px" fw={500}>
                            Dung tích
                        </Text>
                        <div>
                            <Button radius={0} compact variant="default">
                                {state.product.volume}ml
                            </Button>
                        </div>
                        <Text>
                            <span
                                style={{ fontSize: "16px", fontWeight: "500" }}
                            >
                                Năm phát hành
                            </span>
                            : {state.product.year_publish}
                        </Text>
                        <NumberInput
                            defaultValue={1}
                            min={1}
                            max={100}
                            value={numberAddItem}
                            onChange={(value) => setNumberAddItem(value)}
                            label="Số lượng"
                            w={100}
                        />
                        <Group>
                            <Button size="md">Mua ngay</Button>
                            <Button
                                size="md"
                                onClick={() => {
                                    handleAddToCart(state.product);
                                }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Button size="md" onClick={toggle}>
                                Đánh giá
                            </Button>
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Collapse in={opened}>
                <Stack
                    sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
                    p={10}
                >
                    <Center>
                        <Stack>
                            <Text>
                                Hiện tại sản phẩm này chưa có đánh giá nào, Bạn
                                hãy trở thành người đầu tiên đánh giá cho sản
                                phẩm này
                            </Text>
                            <div>
                                <Center>
                                    <Button size="sm">
                                        Gửi đánh giá của bạn
                                    </Button>
                                </Center>
                            </div>
                        </Stack>
                    </Center>
                    <Stack>
                        <Group>
                            <Text>Đánh giá của bạn về sản phẩm: </Text>
                            <Text color="yellow">
                                <IconStarFilled />
                                <IconStarFilled />
                                <IconStarFilled />
                                <IconStar />
                                <IconStar />
                            </Text>
                        </Group>
                        <Textarea
                            placeholder="Nhập nội dung đánh giá của bạn về sản phẩm này"
                            autosize
                            minRows={2}
                            maxRows={4}
                        />
                        <Button disabled>Gửi đánh giá</Button>
                    </Stack>

                    <Stack spacing={0}>
                        <Paper shadow="xs" p="md">
                            <Text fw={500}>Luận Đinh</Text>
                            <Text color="yellow">
                                <IconStarFilled />
                                <IconStarFilled />
                                <IconStarFilled />
                                <IconStar />
                                <IconStar />
                            </Text>
                            <Text color="gray">20/8/2023 19:20:30</Text>
                            <Text>
                                Use it to create cards, dropdowns, modals and
                                other components that require background with
                                shadow
                            </Text>
                        </Paper>
                    </Stack>
                </Stack>
            </Collapse>

            <Stack
                sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
                p={10}
            >
                <Text size="24px" fw={500}>
                    Sản phẩm liên quan
                </Text>
                <Grid gutter={0}>
                    <Grid.Col span={3}>
                        <Product />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Product />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Product />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Product />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Stack>
    );
}

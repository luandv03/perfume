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
    Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Carousel } from "react-responsive-carousel";

import { ProductType } from "../../types/products.type";
import { ProductPhoto } from "../../types/products.type";
import { productService } from "../../services/product.service";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { feedbackService } from "../../services/feedback.service";

interface FeedbackType {
    fullname: string;
    stars: number;
    updated_at: string;
    content: string;
}

export function ProductDetail() {
    const [numberAddItem, setNumberAddItem] = useState<number>(1);
    const [opened, { toggle }] = useDisclosure(false);
    const { state } = useLocation();
    const { product_id } = useParams();
    const [photos, setPhotos] = useState<ProductPhoto[]>([
        { product_photo_id: 0, product_photo_url: "" },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);

    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const { addCartItem } = useContext(CartContext);

    const handleAddToCart = (product: ProductType) => {
        const { product_id, title, price, discount, brand, volume } = product;
        const cartItem = {
            product_id,
            title,
            price,
            discount,
            brand,
            volume,
            quantity: numberAddItem,
        };
        addCartItem(cartItem);
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

    const handleGetFeedback = async () => {
        const res = await feedbackService.getFeedbackByProductId(
            Number(product_id),
            page,
            5
        );

        setTotalPage(res.data.totalPage);
        setFeedbacks(res.data.feedbackList);
    };

    useEffect(() => {
        handleGetProductPhotos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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
                            src={
                                photos.length > 0
                                    ? photos[0].product_photo_url
                                    : ""
                            }
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
                                src={
                                    photos.length > 0
                                        ? photos[0].product_photo_url
                                        : ""
                                }
                                height={100}
                                alt="Norway"
                                fit="contain"
                                sx={{ border: "1px solid #f0e7e7" }}
                            />
                            <Image
                                src={
                                    photos.length > 0
                                        ? photos[0].product_photo_url
                                        : ""
                                }
                                height={100}
                                alt="Norway"
                                fit="contain"
                                sx={{ border: "1px solid #f0e7e7" }}
                            />
                            <Image
                                src={
                                    photos.length > 0
                                        ? photos[0].product_photo_url
                                        : ""
                                }
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

                <Grid.Col span={8} pl={20}>
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
                            onChange={(value) =>
                                setNumberAddItem(value as number)
                            }
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
                                <IconStar />
                                <IconStar />
                                <IconStar />
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
                        {feedbacks.length > 0 &&
                            feedbacks.map((feedback) => (
                                <Paper shadow="xs" p="md">
                                    <Text fw={500}>{feedback.fullname}</Text>
                                    <Text color="yellow">
                                        {Array(feedback.stars)
                                            .fill("a")
                                            .map(() => (
                                                <IconStarFilled />
                                            ))}
                                        {Array(5 - feedback.stars)
                                            .fill("a")
                                            .map(() => (
                                                <IconStar />
                                            ))}
                                    </Text>
                                    <Text color="gray">
                                        {feedback.updated_at}
                                    </Text>
                                    <Text>{feedback.content}</Text>
                                </Paper>
                            ))}

                        <Pagination
                            value={page}
                            onChange={setPage}
                            total={totalPage}
                            mt={10}
                        />
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
                {/* <Grid gutter={0}>
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
                </Grid> */}
            </Stack>
        </Stack>
    );
}

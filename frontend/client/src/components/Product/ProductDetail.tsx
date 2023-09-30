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
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Carousel } from "@mantine/carousel";

import { ProductType } from "../../types/products.type";
import { ProductPhoto } from "../../types/products.type";
import { productService } from "../../services/product.service";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { feedbackService } from "../../services/feedback.service";
import { StarRating } from "../StarRating/StarRating";
import { getItemLocalStorage } from "../../helpers/handleLocalStorage.helper";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { TitlePageWrapper } from "../TitlePageWrapper/TitlePageWrapper";

interface FeedbackType {
    customer_id: number;
    fullname: string;
    stars: number;
    updated_at: string;
    content: string;
}

export function ProductDetail() {
    const [numberAddItem, setNumberAddItem] = useState<number>(1);
    const [opened, { toggle }] = useDisclosure(false);
    const { product_id } = useParams();
    const [product, setProduct] = useState<ProductType>({
        product_id: 0,
        title: "",
        price: 0,
        volume: 0,
        brand: "",
        discount: 0,
        description: "",
        year_publish: 0,
    });

    const [photos, setPhotos] = useState<ProductPhoto[]>([
        { product_photo_id: 0, product_photo_url: "" },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);

    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [myFeedback, setMyFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [indexPhotoSelected, setIndexPhotoSelected] = useState(0);

    const { addCartItem } = useContext(CartContext);
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleGetProductById = async () => {
        const res = await productService.getProductById(Number(product_id));

        console.log(res);
        setProduct(res.data);
    };

    const handleGetProductPhotos = async () => {
        const resPhoto = await productService.getPhotoProductById(
            Number(product_id),
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

    const handleCreateFeedback = async () => {
        if (!getItemLocalStorage("isAuthenticated")) {
            return notifications.show({
                message: "Bạn hãy đăng nhập để đánh giá nhé!",
            });
        }

        const res = await feedbackService.createFeedback(
            Number(product_id),
            rating,
            myFeedback
        );

        if (res.statusCode === 200) {
            handleGetFeedback();
        }

        notifications.show({
            message: res.message,
        });
    };

    const handleRemoveFeedback = async () => {
        if (!getItemLocalStorage("isAuthenticated")) {
            notifications.show({
                message: "Bạn hãy đăng nhập để đánh giá nhé!",
            });
        }

        const res = await feedbackService.removeFeedback(Number(product_id));

        if (res.statusCode == 200) {
            handleGetFeedback();
        }

        notifications.show({
            message: res.message,
        });
    };

    const handleSelectImage = (product_photo_id: number) => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].product_photo_id === product_photo_id) {
                console.log(i);
                return setIndexPhotoSelected(i);
            }
        }
    };

    const handleBuyNow = (product: ProductType) => {
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

        navigate("/cart");
    };

    useEffect(() => {
        handleGetProductById();
        handleGetProductPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <TitlePageWrapper title={`${product?.title} | Perfume LDA`}>
            <Stack>
                <Grid
                    p={10}
                    sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
                    gutter={2}
                >
                    <Grid.Col md={4}>
                        <Stack sx={{ position: "relative" }}>
                            <Image
                                src={
                                    photos.length > 0
                                        ? photos[indexPhotoSelected]
                                              .product_photo_url
                                        : ""
                                }
                                height={300}
                                alt="Norway"
                                fit="contain"
                            />

                            <Carousel withIndicators>
                                {photos.length > 0 &&
                                    photos.map((photo: ProductPhoto) => (
                                        <Carousel.Slide
                                            key={photo.product_photo_id}
                                        >
                                            <Image
                                                src={photo.product_photo_url}
                                                height={100}
                                                alt="Norway"
                                                fit="contain"
                                                sx={{
                                                    border: "1px solid #f0e7e7",
                                                }}
                                                onClick={() =>
                                                    handleSelectImage(
                                                        photo.product_photo_id
                                                    )
                                                }
                                            />
                                        </Carousel.Slide>
                                    ))}
                            </Carousel>

                            {product?.discount > 0 && (
                                <Badge
                                    color="red"
                                    variant="light"
                                    sx={{
                                        position: "absolute",
                                        top: "8px",
                                        left: "8px",
                                    }}
                                >
                                    -{product?.discount}%
                                </Badge>
                            )}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col md={8} pl={12}>
                        <Stack spacing={10}>
                            <Text size="20px" fw={500}>
                                {product?.title}
                            </Text>
                            <Text size="20px" fw={500}>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                    maximumFractionDigits: 9,
                                }).format(product?.price)}
                            </Text>
                            <Text>{product?.description}</Text>
                            <Text size="16px" fw={500}>
                                Thương hiệu
                            </Text>
                            <div>
                                <Button radius={0} compact variant="default">
                                    {product?.brand}
                                </Button>
                            </div>
                            <Text size="16px" fw={500}>
                                Dung tích
                            </Text>
                            <div>
                                <Button radius={0} compact variant="default">
                                    {product?.volume}ml
                                </Button>
                            </div>
                            <Text>
                                <span
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Năm phát hành
                                </span>
                                : {product?.year_publish}
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
                                <Button
                                    size="md"
                                    onClick={() => handleBuyNow(product)}
                                >
                                    Mua ngay
                                </Button>
                                <Button
                                    size="md"
                                    onClick={() => {
                                        handleAddToCart(product);
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
                        sx={{
                            border: "1px solid #f0e7e7",
                            borderRadius: "4px",
                        }}
                        p={10}
                    >
                        {!feedbacks.length && (
                            <Center>
                                <Stack>
                                    <Text>
                                        Hiện tại sản phẩm này chưa có đánh giá
                                        nào, Bạn hãy trở thành người đầu tiên
                                        đánh giá cho sản phẩm này
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
                        )}
                        <Stack>
                            <Group>
                                <Text>Đánh giá của bạn về sản phẩm: </Text>
                                <Text color="yellow">
                                    <StarRating
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                </Text>
                            </Group>
                            <Textarea
                                placeholder="Nhập nội dung đánh giá của bạn về sản phẩm này"
                                value={myFeedback}
                                onChange={(e) => {
                                    setMyFeedback(e.target.value);
                                }}
                                autosize
                                minRows={2}
                                maxRows={4}
                            />
                            <Button
                                maw={180}
                                disabled={!myFeedback}
                                onClick={() => handleCreateFeedback()}
                            >
                                Gửi đánh giá
                            </Button>
                        </Stack>

                        <Stack spacing={0}>
                            {feedbacks.length > 0 &&
                                feedbacks.map((feedback) => (
                                    <Paper shadow="xs" p="md">
                                        <Text fw={500}>
                                            {feedback.fullname} &nbsp;
                                            {feedback.customer_id ===
                                                profile.customer_id && "(Bạn)"}
                                        </Text>
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
                                        {feedback.customer_id ===
                                            profile.customer_id && (
                                            <Button
                                                onClick={() =>
                                                    handleRemoveFeedback()
                                                }
                                            >
                                                Xóa
                                            </Button>
                                        )}
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

                {/* <Stack
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
                </Stack> */}
            </Stack>
        </TitlePageWrapper>
    );
}

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
    Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconStar, IconStarFilled, IconLoader } from "@tabler/icons-react";
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
import { convertTimeStamp } from "../../helpers/convertTimeStamp.helper";

interface FeedbackType {
    customer_id: number;
    fullname: string;
    stars: number;
    updated_at: string;
    content: string;
}

export function ProductDetail() {
    const [loading, setLoading] = useState<boolean>(false);
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
    const [loadingCreateFeedback, setLoadingCreateFeedback] = useState(false);
    const [updatedMyFeedback, setUpdatedMyFeedback] = useState("");
    const [updatedRating, setUpdatedRating] = useState(0);
    const [loadingUpdateFeedback, setLoadingUpdateFeedback] = useState(false);
    const [indexPhotoSelected, setIndexPhotoSelected] = useState(0);
    const [openedUpdateFeedback, setOpenedUpdateFeedback] = useState(false);

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
        setLoading(true);
        const res = await productService.getProductById(Number(product_id));
        setLoading(false);

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

        setLoadingCreateFeedback(true);
        const res = await feedbackService.createFeedback(
            Number(product_id),
            rating,
            myFeedback
        );
        setLoadingCreateFeedback(false);

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

    const handleUpdateFeedback = async (rating: number, content: string) => {
        if (openedUpdateFeedback) {
            setOpenedUpdateFeedback(!openedUpdateFeedback);
        } else {
            setOpenedUpdateFeedback(!openedUpdateFeedback);
        }
        setUpdatedRating(rating);
        setUpdatedMyFeedback(content);
    };

    const handleUpdateFeedbackSubmit = async () => {
        setLoadingUpdateFeedback(true);
        const res = await feedbackService.createFeedback(
            Number(product_id),
            updatedRating,
            updatedMyFeedback
        );
        setLoadingUpdateFeedback(false);

        if (res.statusCode === 200) {
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
                            {loading ? (
                                <>
                                    <Skeleton height={300} />
                                    <Carousel>
                                        <Carousel.Slide>
                                            <Skeleton height={100} />
                                        </Carousel.Slide>
                                    </Carousel>
                                </>
                            ) : (
                                <>
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
                                            photos.map(
                                                (photo: ProductPhoto) => (
                                                    <Carousel.Slide
                                                        key={
                                                            photo.product_photo_id
                                                        }
                                                    >
                                                        <Image
                                                            src={
                                                                photo.product_photo_url
                                                            }
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
                                                )
                                            )}
                                    </Carousel>
                                </>
                            )}

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
                                    {loading ? (
                                        <Skeleton w={10} />
                                    ) : (
                                        `-${product?.discount}%`
                                    )}
                                </Badge>
                            )}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col md={8} pl={12}>
                        {loading ? (
                            <Stack spacing={10}>
                                <Skeleton w={150} h={25}></Skeleton>
                                <Skeleton h={25} w={110} />
                                <Skeleton>
                                    <Text>
                                        Đúng như tên gọi của nó, Original
                                        Vetiver tái tạo mạnh mẽ mùi hương cỏ
                                        vetiver truyền thống. Trước Original
                                        Vetiver, chỉ một phần của cây cỏ vetiver
                                        được sử dụng trong một mùi hương. House
                                        of Creed truyền vào cả ba phần của cây:
                                        rễ cây, lá cây xanh tươi và trái tim
                                        phong phú để làm tươi mát sự pha trộn.
                                        Kết quả là một mùi hương gợi nhớ đến mùa
                                        hè kéo dài, tiếp thêm sinh lực và hoạt
                                        bát, nó để lại một không khí tươi mát
                                        quyến rũ xung quanh bất kỳ ai đủ may mắn
                                        để mặc nó.
                                    </Text>
                                </Skeleton>
                                <Text size="16px" fw={500}>
                                    Brand
                                </Text>
                                <Skeleton h={30} w={60} />
                                <Text size="16px" fw={500}>
                                    Volumn
                                </Text>
                                <Skeleton h={25} w={60} />
                                <Text>
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        Year Publish
                                    </span>
                                    : <Skeleton h={25} w={80} />
                                </Text>
                                <Skeleton h={40} w={100} />
                            </Stack>
                        ) : (
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
                                    Brand
                                </Text>

                                <div>
                                    <Button
                                        radius={0}
                                        compact
                                        variant="default"
                                    >
                                        {product?.brand}
                                    </Button>
                                </div>
                                <Text size="16px" fw={500}>
                                    Volumn
                                </Text>

                                <div>
                                    <Button
                                        radius={0}
                                        compact
                                        variant="default"
                                    >
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
                                        Year Publish
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
                                    label="Quantity"
                                    w={100}
                                />

                                <Group>
                                    <Button
                                        size="md"
                                        onClick={() => handleBuyNow(product)}
                                    >
                                        Buy now
                                    </Button>
                                    <Button
                                        size="md"
                                        onClick={() => {
                                            handleAddToCart(product);
                                        }}
                                    >
                                        Add to cart
                                    </Button>
                                    <Button size="md" onClick={toggle}>
                                        Review
                                    </Button>
                                </Group>
                            </Stack>
                        )}
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
                                        There are currently no reviews for this
                                        product Come on, be the first reviews
                                        for this product
                                    </Text>
                                    <div>
                                        <Center>
                                            <Button size="sm">
                                                Send your feedback
                                            </Button>
                                        </Center>
                                    </div>
                                </Stack>
                            </Center>
                        )}
                        <Stack>
                            <Group>
                                <Text>Your feedback about product: </Text>
                                <Text color="yellow">
                                    <StarRating
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                </Text>
                            </Group>
                            <Textarea
                                placeholder="Enter comment about this product"
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
                                disabled={!myFeedback || loadingCreateFeedback}
                                onClick={() => handleCreateFeedback()}
                            >
                                {!loadingCreateFeedback ? (
                                    "Send feedback"
                                ) : (
                                    <IconLoader
                                        className={
                                            loadingCreateFeedback
                                                ? "spinner"
                                                : ""
                                        }
                                    />
                                )}
                            </Button>
                        </Stack>

                        <Stack spacing={0}>
                            {feedbacks.length > 0 &&
                                feedbacks.map((feedback) => (
                                    <Paper shadow="xs" p="md">
                                        <Text fw={500}>
                                            {feedback.fullname} &nbsp;
                                            {feedback.customer_id ===
                                                profile.customer_id && "(You)"}
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
                                        <Text color="gray" mb={4}>
                                            {convertTimeStamp(
                                                feedback.updated_at
                                            )}
                                        </Text>

                                        <Text
                                            color="gray"
                                            bg="#e9ecef"
                                            mt={10}
                                            mb={4}
                                            span
                                            p={4}
                                            sx={{
                                                color: "#333",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <span>{feedback.content}</span>
                                        </Text>
                                        {feedback.customer_id ===
                                            profile.customer_id && (
                                            <>
                                                <Group>
                                                    <Text
                                                        sx={{
                                                            "&:hover": {
                                                                cursor: "pointer",
                                                                textDecoration:
                                                                    "underline",
                                                            },
                                                        }}
                                                        fw={500}
                                                        color="#65676B"
                                                        onClick={() =>
                                                            handleUpdateFeedback(
                                                                feedback.stars,
                                                                feedback.content
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Text>
                                                    <Text
                                                        sx={{
                                                            "&:hover": {
                                                                cursor: "pointer",
                                                                textDecoration:
                                                                    "underline",
                                                            },
                                                        }}
                                                        fw={500}
                                                        onClick={() =>
                                                            handleRemoveFeedback()
                                                        }
                                                        color="#65676B"
                                                    >
                                                        Delete
                                                    </Text>
                                                </Group>

                                                {/* Update feedback */}
                                                <Collapse
                                                    in={openedUpdateFeedback}
                                                >
                                                    <Stack mt={5} pl={10}>
                                                        <Text color="yellow">
                                                            <StarRating
                                                                rating={
                                                                    updatedRating
                                                                }
                                                                setRating={
                                                                    setUpdatedRating
                                                                }
                                                            />
                                                        </Text>
                                                        <Textarea
                                                            placeholder="Nhập nội dung đánh giá của bạn về sản phẩm này"
                                                            value={
                                                                updatedMyFeedback
                                                            }
                                                            onChange={(e) => {
                                                                setUpdatedMyFeedback(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            autosize
                                                            minRows={2}
                                                            maxRows={4}
                                                        />
                                                        <Button
                                                            maw={180}
                                                            disabled={
                                                                !updatedMyFeedback ||
                                                                loadingUpdateFeedback ||
                                                                (feedback.content ==
                                                                    updatedMyFeedback &&
                                                                    feedback.stars ==
                                                                        updatedRating)
                                                            }
                                                            onClick={() =>
                                                                handleUpdateFeedbackSubmit()
                                                            }
                                                        >
                                                            {!loadingUpdateFeedback ? (
                                                                "Sửa"
                                                            ) : (
                                                                <IconLoader
                                                                    className={
                                                                        loadingUpdateFeedback
                                                                            ? "spinner"
                                                                            : ""
                                                                    }
                                                                />
                                                            )}
                                                        </Button>
                                                    </Stack>
                                                </Collapse>
                                            </>
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
            </Stack>
        </TitlePageWrapper>
    );
}

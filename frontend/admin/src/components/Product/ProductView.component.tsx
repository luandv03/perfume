import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Text, Flex, Box, Button } from "@mantine/core";
import {
    IconPhoto,
    IconMessageCircle,
    IconSettings,
    IconDeviceFloppy,
    IconTrash,
} from "@tabler/icons-react";
import { Link, Outlet, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { productService } from "../../services/product.service";

interface ProductType {
    product_id: number;
    category_id: number;
    title: string;
    description: string;
    brand: string;
    year_publish: number;
    volume: number;
    price: number;
    discount: number;
    quantity: number;
}

let markProduct: ProductType;

export function ProductView() {
    const [product, setProduct] = useState<ProductType>({
        product_id: 0,
        category_id: 0,
        title: "",
        description: "",
        brand: "",
        year_publish: 0,
        volume: 0,
        price: 0,
        discount: 0,
        quantity: 0,
    });
    const location = useLocation();
    const { product_id } = useParams();

    const handleGetProductById = async () => {
        const data = await productService.getProductById(Number(product_id));

        markProduct = data.data;
        setProduct(data.data);
    };

    const handleUpdateProduct = async () => {
        const data = await productService.updateProductById(product);

        notifications.show({
            title: "Update product",
            message: data.message + data.statusCode,
        });

        markProduct = data.data;
        setProduct(data.data);
    };

    useEffect(() => {
        handleGetProductById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tabs
            value={location.pathname} // this is active current link location
            defaultValue={`/product/${product_id}`}
            sx={{ width: "100%" }}
        >
            <Tabs.List>
                <Tabs.Tab
                    fw={400}
                    value={`/product/${product.product_id}`}
                    icon={<IconPhoto size="0.8rem" />}
                >
                    <Link
                        to={`/product/${product_id}`}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Photo</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value={`/product/${product_id}/detail`}
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Link
                        to={`/product/${product_id}/detail`}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Detail</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value={`/product/${product_id}/description`}
                    icon={<IconSettings size="0.8rem" />}
                >
                    <Link
                        to={`/product/${product_id}/description`}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Description</Text>
                    </Link>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value={`/product/${product_id}/feedback`}
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Link
                        to={`/product/${product_id}/feedback`}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Text size="lg">Feedback</Text>
                    </Link>
                </Tabs.Tab>
            </Tabs.List>

            {/* body */}
            <Flex style={{ minWidth: "800px" }} py={10}>
                <Outlet context={[product, setProduct]} />
            </Flex>

            {/* //footer */}
            <Flex style={{ width: "100%", marginTop: "20px" }}>
                <Box
                    sx={(theme) => ({
                        width: "100%",
                        height: "65px",
                        backgroundColor: theme.colors.gray[1],
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    })}
                >
                    <Flex
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        justify="space-between"
                        align="center"
                    >
                        <Button
                            size="md"
                            radius="md"
                            sx={() => ({
                                cursor: "pointer",
                                "&hover": {
                                    opacity: "0.9",
                                },
                            })}
                            disabled={
                                JSON.stringify(markProduct) ===
                                JSON.stringify(product)
                            }
                            onClick={() => handleUpdateProduct()}
                        >
                            <IconDeviceFloppy style={{ marginRight: "5px" }} />
                            Save
                        </Button>
                        <Button
                            size="md"
                            radius="md"
                            variant="subtle"
                            color="gray"
                            sx={(them) => ({
                                color: "red",
                                "&hover": {
                                    backgroundColor: them.colors.black,
                                },
                            })}
                            disabled
                        >
                            <IconTrash
                                style={{
                                    marginRight: "5px",
                                }}
                            />
                            Delete
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Tabs>
    );
}

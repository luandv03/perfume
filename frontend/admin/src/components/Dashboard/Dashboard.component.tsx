import { Stack, Flex, Box, Text, Group } from "@mantine/core";
import {
    IconCurrencyDollar,
    IconShoppingCart,
    IconMessage,
    IconUserPlus,
    IconStarFilled,
    IconStar,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import { LineChart } from "../LineChart";
import { feedbackService } from "../../services/feedback.service";
import { customerService } from "../../services/customer.service";
import { orderService } from "../../services/order.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";

Chart.register(CategoryScale);

export const Data = [
    {
        id: 1,
        month: "T6",
        userGain: 80000000,
        userLost: 823,
    },
    {
        id: 2,
        month: "T7",
        userGain: 45677000,
        userLost: 345,
    },
    {
        id: 3,
        month: "T8",
        userGain: 78888000,
        userLost: 555,
    },
    {
        id: 4,
        month: "T9",
        userGain: 90000000,
        userLost: 4555,
    },
    {
        id: 5,
        month: "T10",
        userGain: 43000000,
        userLost: 234,
    },
];

export default function Dashboard() {
    const [feedbackRecently, setFeedbackRecently] = useState({
        feedbacks: [
            {
                fullname: "0",
                content: "",
                stars: 0,
            },
        ],
        number_of_feedbacks: 0,
    });

    const [customerRecently, setCustomerRecently] = useState({
        customers: [
            {
                customer_id: 0,
                fullname: "",
                email: "",
            },
        ],
        number_of_customers: 0,
    });

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.month),
        datasets: [
            {
                label: "Total",
                data: Data.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "&quot#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    });

    const [orderPending, setOrderPending] = useState({
        orders: [
            {
                order_id: 135,
                customer_id: 33,
                n_item: 1,
                tax: 0,
                delivery_cost: 0,
                tong_giam_gia: 0,
                order_date: "2023-09-25T17:00:00.000Z",
                payment_type: "vnpay",
                tong_hoa_don: 295000,
            },
        ],
        page: 1,
        total: 10,
        totalPage: 3,
        totalOrders: 22,
    });

    const handleGetRecentlyFeedback = async () => {
        const res = await feedbackService.getRecentlyFeedback();

        setFeedbackRecently(res.data);
    };

    const handleGetRecentlyCustomer = async () => {
        const res = await customerService.getRecentlyCustomer();

        setCustomerRecently(res.data);
    };

    const hanldeGetOrderPending = async () => {
        const res = await orderService.getOrder(1, 14, "ordered");

        setOrderPending(res.data);
    };

    useEffect(() => {
        handleGetRecentlyFeedback();
        handleGetRecentlyCustomer();
        hanldeGetOrderPending();
    }, []);

    return (
        <Flex gap="16px" sx={{ width: "100%" }}>
            <Flex>
                <Stack>
                    <Flex gap="16px">
                        <Box
                            h="90px"
                            w="220px"
                            pl={18}
                            pr={8}
                            sx={{
                                borderRadius: "10px",
                                border: "1px solid rgb(224, 224, 227)",
                            }}
                        >
                            <Flex
                                align="center"
                                justify="space-between"
                                sx={{ height: "100%", width: "100%" }}
                            >
                                <IconCurrencyDollar color="rgb(40, 53, 147)" />
                                <Stack spacing={0}>
                                    <Text sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                        Monthly Revenue
                                    </Text>
                                    <Text fw={500} size="md">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                            maximumFractionDigits: 9,
                                        }).format(43000000)}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Box>
                        <Box
                            h="90px"
                            w="220px"
                            pl={18}
                            pr={8}
                            sx={{
                                borderRadius: "10px",
                                border: "1px solid rgb(224, 224, 227)",
                            }}
                        >
                            <Flex
                                align="center"
                                justify="space-between"
                                sx={{ height: "100%", width: "100%" }}
                            >
                                <IconShoppingCart color="rgb(40, 53, 147)" />
                                <Stack spacing={0}>
                                    <Text sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                        New Orders
                                    </Text>
                                    <Text fw={500} size="md">
                                        {orderPending?.totalOrders}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Box>
                    </Flex>
                    <Stack>
                        <LineChart chartData={chartData} />
                    </Stack>

                    <Stack>
                        <Text fw={500} size="xl">
                            Pending Orders
                        </Text>

                        <Stack spacing={1}>
                            {orderPending?.orders.length > 0 &&
                                orderPending?.orders.map((order) => (
                                    <Link
                                        to={`/order/detail/${order.order_id}`}
                                        key={order.order_id}
                                    >
                                        <Group
                                            position="apart"
                                            p={4}
                                            sx={{
                                                "&:hover": {
                                                    background:
                                                        "rgb(224, 224, 227)",
                                                },
                                            }}
                                        >
                                            <Stack spacing={0}>
                                                <Box>
                                                    <Text>
                                                        {handleOrderDate(
                                                            order.order_date
                                                        )}
                                                    </Text>
                                                </Box>
                                                <Text
                                                    sx={{
                                                        color: "rgba(0, 0, 0, 0.6)",
                                                    }}
                                                >
                                                    CustomerId:{" "}
                                                    {order.customer_id},{" "}
                                                    {order.n_item} sản phẩm
                                                </Text>
                                            </Stack>

                                            <Text size="md" fw={500}>
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                        maximumFractionDigits: 9,
                                                    }
                                                ).format(order.tong_hoa_don)}
                                            </Text>
                                        </Group>
                                    </Link>
                                ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Flex>

            <Flex gap="16px">
                <Stack w="220px" spacing={0}>
                    <Box
                        h="90px"
                        pl={18}
                        pr={8}
                        sx={{
                            width: "100%",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            border: "1px solid rgb(224, 224, 227)",
                        }}
                    >
                        <Flex
                            align="center"
                            justify="space-between"
                            sx={{ height: "100%", width: "100%" }}
                        >
                            <IconMessage color="rgb(40, 53, 147)" />
                            <Stack spacing={0}>
                                <Text sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                    Rencently Feedbacks
                                </Text>
                                <Text fw={500} size="md">
                                    {feedbackRecently?.number_of_feedbacks}
                                </Text>
                            </Stack>
                        </Flex>
                    </Box>
                    <Stack
                        sx={{
                            width: "100%",
                            border: "1px solid rgb(224, 224, 227)",
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                        }}
                        spacing={0}
                        pb={10}
                        pt={10}
                    >
                        {feedbackRecently?.feedbacks.length > 0 &&
                            feedbackRecently?.feedbacks.map(
                                (feedback, index) => (
                                    <Box
                                        key={index}
                                        pl={18}
                                        pr={6}
                                        pt={5}
                                        sx={{
                                            width: "100%",
                                            "&:hover": {
                                                cursor: "pointer",
                                                background:
                                                    "rgb(224, 224, 227)",
                                            },
                                        }}
                                    >
                                        <Stack spacing={0}>
                                            <Text size="md" fw={500}>
                                                {feedback.fullname}
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

                                            <Text lineClamp={3}>
                                                {feedback.content}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )
                            )}
                    </Stack>
                </Stack>
                <Stack w="220px" spacing={0}>
                    <Box
                        h="90px"
                        pl={18}
                        pr={8}
                        sx={{
                            width: "100%",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            border: "1px solid rgb(224, 224, 227)",
                        }}
                    >
                        <Flex
                            align="center"
                            justify="space-between"
                            sx={{ height: "100%", width: "100%" }}
                        >
                            <IconUserPlus color="rgb(40, 53, 147)" />
                            <Stack spacing={0}>
                                <Text sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                    New Customers
                                </Text>
                                <Text fw={500} size="md">
                                    {customerRecently.number_of_customers}
                                </Text>
                            </Stack>
                        </Flex>
                    </Box>
                    <Stack
                        sx={{
                            width: "100%",
                            border: "1px solid rgb(224, 224, 227)",
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                        }}
                        spacing={0}
                        pb={10}
                        pt={10}
                    >
                        {customerRecently?.customers.length > 0 &&
                            customerRecently?.customers.map((customer) => (
                                <Link
                                    key={customer.customer_id}
                                    to={`/customer/detail/${customer.customer_id}`}
                                >
                                    <Box
                                        pl={18}
                                        pr={6}
                                        pt={5}
                                        sx={{
                                            "&:hover": {
                                                cursor: "pointer",
                                                background:
                                                    "rgb(224, 224, 227)",
                                            },
                                        }}
                                    >
                                        <Stack spacing={0}>
                                            <Text size="md" fw={500}>
                                                {customer.fullname}
                                            </Text>
                                            <Text lineClamp={1}>
                                                {customer.email}
                                            </Text>
                                        </Stack>
                                    </Box>
                                </Link>
                            ))}
                    </Stack>
                </Stack>
            </Flex>
        </Flex>
    );
}

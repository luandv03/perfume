import {
    Alert,
    Checkbox,
    Flex,
    Pagination,
    Select,
    Stack,
    Table,
    createStyles,
    rem,
    Text,
} from "@mantine/core";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { feedbackService } from "../../services/feedback.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface FeedbackType {
    product_id: number;
    customer_id: number;
    content: string;
    stars: number;
    created_at: string;
    updated_at: string;
    fullname: string;
}

export function ProductFeedback() {
    const [feedbacks, setFeedbacks] = useState<FeedbackType[] | []>([]);
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState<number[]>([0]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<string>("10");

    const { product_id } = useParams();

    const toggleRow = (id: number) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === feedbacks.length
                ? []
                : feedbacks.map((item) => item.customer_id)
        );

    const handleListFeedbacks = async () => {
        const res = await feedbackService.getFeedbackProductId(
            Number(product_id),
            Number(page),
            Number(total)
        );

        setTotalPage(res.data.totalPage);
        setFeedbacks(res.data.feedbackList);
    };

    useEffect(() => {
        handleListFeedbacks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total]);

    const rows =
        feedbacks.length &&
        feedbacks.map((item) => {
            const selected = selection.includes(item.customer_id);
            return (
                <tr
                    key={item.customer_id}
                    className={cx({ [classes.rowSelected]: selected })}
                >
                    <td>
                        <Checkbox
                            checked={selection.includes(item.customer_id)}
                            onChange={() => toggleRow(item.customer_id)}
                            transitionDuration={0}
                        />
                    </td>
                    <td>{handleOrderDate(item.updated_at)}</td>
                    <td>
                        <Link
                            to={`/customer/detail/${item.customer_id}`}
                            style={{ textDecoration: "none" }}
                        >
                            {item.fullname}
                        </Link>
                    </td>
                    <td style={{ color: "#e0e03e" }}>
                        <>
                            {Array(item.stars)
                                .fill("a")
                                .map(() => (
                                    <IconStarFilled />
                                ))}
                            {Array(5 - item.stars)
                                .fill("a")
                                .map(() => (
                                    <IconStar />
                                ))}
                        </>
                    </td>
                    <td>{item.content}</td>
                </tr>
            );
        });

    return (
        <Stack w="100%">
            {feedbacks.length > 0 ? (
                <>
                    <Table miw={800} verticalSpacing="sm" striped>
                        <thead>
                            <tr>
                                <th style={{ width: rem(40) }}>
                                    <Checkbox
                                        onChange={toggleAll}
                                        checked={
                                            selection.length ===
                                            feedbacks.length
                                        }
                                        indeterminate={
                                            selection.length > 0 &&
                                            selection.length !==
                                                feedbacks.length
                                        }
                                        transitionDuration={0}
                                    />
                                </th>
                                <th>Date</th>
                                <th>CustomerID</th>
                                <th>Rating</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>

                    <Flex sx={{ width: "100%" }} justify="flex-end" gap="xs">
                        <Select
                            placeholder="Pick one"
                            data={[
                                { value: "10", label: "10 products" },
                                { value: "20", label: "20 products" },
                                { value: "50", label: "50 products" },
                                { value: "100", label: "100 products" },
                            ]}
                            value={total}
                            onChange={(value: string) => {
                                setPage(1); // page default = 1 when change total product / page
                                setTotal(value);
                            }}
                        />
                        <Pagination
                            value={page}
                            onChange={setPage}
                            total={totalPage}
                        />
                    </Flex>
                </>
            ) : (
                <Alert title="Oops!" color="red">
                    <Text fw={700}>Have no feedback</Text>
                </Alert>
            )}
        </Stack>
    );
}

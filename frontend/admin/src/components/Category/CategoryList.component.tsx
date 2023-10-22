import { useState, useEffect } from "react";
import {
    createStyles,
    Table,
    Checkbox,
    ScrollArea,
    Flex,
    Box,
    Stack,
    NavLink,
    rem,
    ActionIcon,
    Modal,
    Input,
    Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";

import { categoryService } from "../../services/category.service";

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface TableSelectionProps {
    category_id: number;
    category_name: string;
}

export function CategoryList() {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState([1]);
    const [opened, { open, close }] = useDisclosure(false);
    const [listCategories, setListCategories] = useState([
        {
            category_id: 0,
            category_name: "",
        },
    ]);
    const [category, setCategory] = useState({
        category_id: 0,
        category_name: "",
    });
    const [categorySelected, setCategorySelected] = useState("");

    const [activeSave, setActiveSave] = useState(false);

    const toggleRow = (id: number) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === listCategories.length
                ? []
                : listCategories.map((item) => item.category_id)
        );

    const handleGetCategory = async () => {
        const data = await categoryService.getAllCategories();

        setListCategories(data.data);
    };

    const handeEditCategory = async ({
        category_id,
        category_name,
    }: {
        category_id: number;
        category_name: string;
    }) => {
        const data = await categoryService.updateCategoryById(
            category_id,
            category_name
        );

        if (data.statusCode === 200) {
            setListCategories((prev) => {
                const cate = prev.map((item) =>
                    item.category_id == data.data.category_id ? data.data : item
                );

                return cate;
            });
        }

        close();

        notifications.show({
            title: "Default notification",
            message: data.message + ": " + data.statusCode,
        });
    };

    const handleDeleteCategoryById = async (category_id: number) => {
        const data = await categoryService.deleteCategoryById(category_id);

        if (data.statusCode === 200) {
            setListCategories((prev) => {
                const cate = prev.filter(
                    (item) => item.category_id !== data.data.category_id
                );

                return cate;
            });
        }

        notifications.show({
            title: "Default notification",
            message: data.message + ": " + data.statusCode,
        });
    };

    useEffect(() => {
        handleGetCategory();
    }, []);

    const rows =
        listCategories.length &&
        listCategories.map((item: TableSelectionProps) => {
            const selected = selection.includes(item.category_id);
            return (
                <tr
                    key={item.category_id}
                    className={cx({ [classes.rowSelected]: selected })}
                >
                    <td>
                        <Checkbox
                            checked={selection.includes(item.category_id)}
                            onChange={() => toggleRow(item.category_id)}
                            transitionDuration={0}
                        />
                    </td>
                    <td>{item.category_id}</td>
                    <td>{item.category_name}</td>
                    <td>
                        <Flex>
                            <ActionIcon
                                onClick={() => {
                                    open();
                                    setCategory(item);
                                    setCategorySelected(item.category_name);
                                }}
                                color="black"
                            >
                                <IconPencil />
                            </ActionIcon>
                            <ActionIcon
                                onClick={() => {
                                    handleDeleteCategoryById(item.category_id);
                                }}
                                color="black"
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Flex>
                    </td>
                </tr>
            );
        });

    return (
        <ScrollArea>
            <Stack>
                <Flex justify="flex-end" style={{ width: "100%" }}>
                    <Box>
                        <NavLink
                            label="CREATE"
                            icon={<IconPlus size="1.4rem" />}
                            component="a"
                            href="/category/create"
                            sx={{
                                color: "blue",
                                fontWeight: "500",
                            }}
                        />
                    </Box>
                </Flex>

                <Table miw={800} verticalSpacing="sm" withColumnBorders>
                    <thead>
                        <tr>
                            <th style={{ width: rem(40) }}>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={
                                        selection.length ===
                                        listCategories.length
                                    }
                                    indeterminate={
                                        selection.length > 0 &&
                                        selection.length !==
                                            listCategories.length
                                    }
                                    transitionDuration={0}
                                />
                            </th>
                            <th>ID</th>
                            <th>Category Name</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Stack>
            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    setActiveSave(false);
                }}
                title="Edit category"
            >
                <Stack>
                    <Input
                        value={category.category_name}
                        onChange={(e) => {
                            setActiveSave(
                                categorySelected !== e.target.value
                                    ? true
                                    : false
                            );
                            setCategory({
                                category_id: category.category_id,
                                category_name: e.target.value,
                            });
                        }}
                    />

                    <Flex justify="flex-end">
                        <Button
                            onClick={() => handeEditCategory(category)}
                            disabled={!activeSave}
                        >
                            Save
                        </Button>
                    </Flex>
                </Stack>
            </Modal>
        </ScrollArea>
    );
}

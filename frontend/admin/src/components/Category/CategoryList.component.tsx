import { useState } from "react";
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
import { IconPlus, IconPencil } from "@tabler/icons-react";

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

const data: TableSelectionProps[] = [
    {
        category_id: 1,
        category_name: "Nước hoa Nam",
    },
    {
        category_id: 2,
        category_name: "Nước hoa Nữ",
    },
    {
        category_id: 3,
        category_name: "Nước hoa Unisex",
    },
];

export function CategoryList() {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState([1]);
    const [opened, { open, close }] = useDisclosure(false);
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
            current.length === data.length
                ? []
                : data.map((item) => item.category_id)
        );

    const rows = data.map((item) => {
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
                                    checked={selection.length === data.length}
                                    indeterminate={
                                        selection.length > 0 &&
                                        selection.length !== data.length
                                    }
                                    transitionDuration={0}
                                />
                            </th>
                            <th>ID</th>
                            <th>Tên danh mục</th>
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
                            onClick={() => console.log(category)}
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

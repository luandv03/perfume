import { Textarea } from "@mantine/core";

export function ProductDes() {
    return (
        <Textarea
            placeholder="Mô tả..."
            label="Mô tả"
            withAsterisk
            autosize
            minRows={4}
            maxRows={8}
        />
    );
}

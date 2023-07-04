import { Flex, Box, Image, createStyles } from "@mantine/core";

const useStyles = createStyles({
    shadowHover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            cursor: "pointer",
        },
    },
});

export function ProductImage() {
    const { classes } = useStyles();

    return (
        <Flex
            style={{
                width: "100%",
            }}
            wrap="wrap"
            direction="row"
            gap="xs"
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                (item: number) => (
                    <Box className={classes.shadowHover}>
                        <Image
                            key={item}
                            width={150}
                            mx="auto"
                            radius="md"
                            src="https://cdn.shopify.com/s/files/1/0268/8267/0792/products/1_e73ea800-9922-49cb-ba2f-555060ec1e99.jpg?v=1674566715"
                            alt="Random image"
                        />
                    </Box>
                )
            )}
        </Flex>
    );
}

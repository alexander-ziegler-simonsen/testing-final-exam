import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

export default function Footer() {
    return (
        <Box w={"full"}
            display={"flex"} p={2} alignItems={"center"} justifyContent={"center"}
            // shadow={"xl"} 
            // borderBottomWidth={1} borderBottomColor={"gray.400"}
            // marginBottom={1}
            // bgGradient="to-t" gradientFrom="gray.300" gradientTo="gray.500"
            bg={"gray.100"}
        >
            <Grid templateColumns={{
                sm: "repeat(1, 1fr)",
                md: "repeat(4, 1fr)"
            }}
                gap={{ sm: 0, md: "28" }} alignItems={"center"} justifyContent={"center"}>
                <GridItem>
                    <Text>footer part 1</Text>
                </GridItem>
                <GridItem>
                    <Text>footer part 2</Text>
                </GridItem>
                <GridItem>
                    <Text>footer part 3</Text>
                </GridItem>
                <GridItem>
                    <Text>footer part 4</Text>
                </GridItem>
            </Grid>
        </Box>
    );
}

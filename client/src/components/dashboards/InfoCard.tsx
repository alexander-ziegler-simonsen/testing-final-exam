
import { Box, HStack, Text } from "@chakra-ui/react";
import { quickShadow } from "../CustomRecipes";

interface InfoCardProps {
    title: string;
    value: string;
    type?: string;
}

export default function InfoCard({ title, value, type }: InfoCardProps) {

    return (
        <Box bg={"whiteAlpha.100"}
            css={quickShadow}
            minW={"200px"}
            p={6} height={"auto"} border={"1px solid"} rounded={18}>
            {
                type != null
                    ? (<HStack>
                        <Text fontSize={22} fontWeight={"normal"} marginEnd={"auto"}>{title}</Text>
                        <Text fontSize={22} fontWeight={"normal"} p={1} border={"1px solid"} rounded={2}>{type}</Text>
                    </HStack>)
                    : <Text fontSize={22} fontWeight={"normal"}>{title}</Text>
            }
            <Text fontSize={28} fontWeight={"bold"}>{value}</Text>

        </Box>
    );
}

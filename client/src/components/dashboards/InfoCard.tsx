
import { Box, HStack, Text } from "@chakra-ui/react";
import { quickShadow } from "../CustomRecipes";

interface InfoCardProps {
    title: string;
    value: string;
    type?: string;
    // data-testid for this card instance. Caller supplies it so multiple
    // cards rendered in a list get distinct, caller-controlled selectors.
    testId: string;
}

export default function InfoCard({ title, value, type, testId }: InfoCardProps) {

    return (
        <Box bg={"whiteAlpha.100"}
            css={quickShadow}
            minW={"200px"}
            p={6} height={"auto"} border={"1px solid"} rounded={18}
            data-testid={testId}>
            {
                type != null
                    ? (<HStack>
                        <Text fontSize={22} fontWeight={"normal"} marginEnd={"auto"} data-testid={`${testId}-title`}>{title}</Text>
                        <Text fontSize={22} fontWeight={"normal"} p={1} border={"1px solid"} rounded={2} data-testid={`${testId}-type`}>{type}</Text>
                    </HStack>)
                    : <Text fontSize={22} fontWeight={"normal"} data-testid={`${testId}-title`}>{title}</Text>
            }
            <Text fontSize={28} fontWeight={"bold"} data-testid={`${testId}-value`}>{value}</Text>

        </Box>
    );
}

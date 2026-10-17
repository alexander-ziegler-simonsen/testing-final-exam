import { Button, createListCollection, Portal, Select, Stack, Tabs, Text } from "@chakra-ui/react";
import { useExternalMedicinStore } from "../../stores/ExternalMedicinStore";
import { useColorMode } from "../../components/ui/color-mode";

export default function ConfigDashboard() {
    const { colorMode, toggleColorMode } = useColorMode();
    const fontOptions = createListCollection(
        {
            items: [
                { label: "xs", value: "xs" },
                { label: "sm", value: "sm" },
                { label: "md", value: "md" },
                { label: "lg", value: "lg" },
                { label: "xl", value: "xl" },
                { label: "2xl", value: "2xl" },
                { label: "3xl", value: "3xl" },
                { label: "4xl", value: "4xl" },
                { label: "5xl", value: "5xl" },
                { label: "6xl", value: "6xl" }
            ],
        });

    return (
        <>
            <Text data-testid="placeholderText">ConfigDashboard</Text>
            <Tabs.Root defaultValue="facilities" data-testid="facilities-tabs">
                <Tabs.List mb="4">
                    <Tabs.Trigger value="settings" data-testid="config-settings-tab">settings</Tabs.Trigger>
                    <Tabs.Trigger value="forDev" data-testid="config-forDev-tab">for dev</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="settings">
                    <Stack>
                        <div>
                            <Text>Font size</Text>
                        <Select.Root collection={fontOptions} data-testid="config-font-size-select">
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select font size" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {fontOptions.items.map((fontOptions) => (
                                            <Select.Item item={fontOptions} key={fontOptions.value}>
                                                {fontOptions.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        </div>
                        <div>
                            <Text>change color schema</Text>
                            <Button data-testid="config-change-color-schema-button" onClick={toggleColorMode}>
                                Change (currently {colorMode})
                            </Button>
                        </div>
                    </Stack>
                </Tabs.Content>

                <Tabs.Content value="forDev">
                    <Stack>
                        <div>
                            <Text>Reset localStorage for external API</Text>
                            <Button data-testid="config-reset-external-api-button" onClick={() => {
                                useExternalMedicinStore.setState({ missingDetailIds: [] });
                                useExternalMedicinStore.persist.clearStorage();
                            }}>Reset</Button>
                        </div>
                    </Stack>
                </Tabs.Content>
            </Tabs.Root >
        </>
    );
}

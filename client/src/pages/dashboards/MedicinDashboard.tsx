import { useEffect } from "react";
import { Tabs, Text } from "@chakra-ui/react";
import { useSearchParams } from "react-router";
import { LuFlaskConical, LuPackageX, LuTextSearch, LuWarehouse } from "react-icons/lu";
import { useExternalMedicinStore } from "../../stores/ExternalMedicinStore";
import StorageTab from "../../components/dashboards/medicin/StorageTab";
import MissingMedicinTab from "../../components/dashboards/medicin/MissingMedicinTab";
import ExternalMedicinSearchTab from "../../components/dashboards/medicin/ExternalMedicinSearchTab";

const medicinTabs = ["storage", "missing", "name", "ingredient"] as const;
type MedicinTab =(typeof medicinTabs)[number];

const isMedicinTab = (value: string | null): value is MedicinTab => medicinTabs.includes(value as MedicinTab);

export default function MedicinDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchMode = useExternalMedicinStore((state) => state.searchMode);
  const searched = useExternalMedicinStore((state) => state.searched);
  const setSearch = useExternalMedicinStore((state) => state.setSearch);

  // The active tab lives in the URL (/app/medicin?tab=missing), so sub pages can
  // link back to a specific tab. Without a valid ?tab we fall back to the tab of
  // the last search, or storage.
  const tabParam = searchParams.get("tab");
  const activeTab: MedicinTab = isMedicinTab(tabParam) ? tabParam : searched ? searchMode : "storage";

  // The store only holds one search, so opening the name or ingredient tab
  // (by click or by URL) starts fresh instead of showing the other tab's results.
  useEffect(() => {
    if ((activeTab === "name" || activeTab === "ingredient") && activeTab !== searchMode) {
      setSearch({ searchMode: activeTab, query: "", results: [], searched: false });
    }
  }, [activeTab, searchMode, setSearch]);

  return (
    <>
      <Text data-testid="header_MedicinDashboard" fontSize="xl" fontWeight="bold">
        MedicinDashboard
      </Text>

      <Tabs.Root
        value={activeTab}
        lazyMount
        unmountOnExit
        onValueChange={(e) => setSearchParams({ tab: e.value }, { replace: true })}>
        <Tabs.List>
          <Tabs.Trigger value="storage">
            <LuWarehouse />
            storage
          </Tabs.Trigger>
          <Tabs.Trigger value="missing">
            <LuPackageX />
            report medicin missing
          </Tabs.Trigger>
          <Tabs.Trigger value="name">
            <LuTextSearch />
            search by name
          </Tabs.Trigger>
          <Tabs.Trigger value="ingredient">
            <LuFlaskConical />
            search by ingredient
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="storage">
          <StorageTab />
        </Tabs.Content>
        <Tabs.Content value="missing">
          <MissingMedicinTab />
        </Tabs.Content>
        <Tabs.Content value="name">
          <ExternalMedicinSearchTab mode="name" />
        </Tabs.Content>
        <Tabs.Content value="ingredient">
          <ExternalMedicinSearchTab mode="ingredient" />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

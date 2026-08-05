import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { HospitalApiDtosExternalMedicineProductOutputDto } from "../api";

type SearchMode = "name" | "ingredient";

interface ExternalMedicinState {
    missingDetailIds: string[];
    markDetailsMissing: (id: string) => void;
    markDetailsAvailable: (id: string) => void;
    hasMissingDetails: (id: string) => boolean;

    // Last search performed on the list page, kept in memory so navigating
    // to a detail page and back doesn't force the user to search again.
    searchMode: SearchMode;
    query: string;
    results: HospitalApiDtosExternalMedicineProductOutputDto[];
    searched: boolean;
    setSearch: (search: {
        searchMode: SearchMode;
        query: string;
        results: HospitalApiDtosExternalMedicineProductOutputDto[];
        searched: boolean;
    }) => void;
}

// The external registry doesn't tell us up front whether a product's detail
// page actually has data - we only find out by visiting it. Once a lookup
// 404s, remember it here so the search results can grey it out next time
// instead of sending the user down a dead end again.
export const useExternalMedicinStore = create<ExternalMedicinState>()(
    persist(
        (set, get) => ({
            missingDetailIds: [],
            markDetailsMissing: (id) =>
                set((state) =>
                    state.missingDetailIds.includes(id)
                        ? state
                        : { missingDetailIds: [...state.missingDetailIds, id] },
                ),
            markDetailsAvailable: (id) =>
                set((state) => ({
                    missingDetailIds: state.missingDetailIds.filter((existing) => existing !== id),
                })),
            hasMissingDetails: (id) => get().missingDetailIds.includes(id),

            searchMode: "name",
            query: "",
            results: [],
            searched: false,
            setSearch: (search) => set(search),
        }),
        {
            name: "external-medicin-missing-details",
            storage: createJSONStorage(() => localStorage),
            // Only the missing-details memory needs to survive across
            // browser sessions; the last search just needs to survive
            // navigating away and back, so keep it in-memory only.
            partialize: (state) => ({ missingDetailIds: state.missingDetailIds }),
        },
    ),
);

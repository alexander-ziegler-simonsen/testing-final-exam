import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MedicineProductResponse } from "../api/Responses/MedicineProductResponse";

type SearchMode = "name" | "ingredient";

interface ExternalMedicinState {
    missingDetailIds: string[];
    markDetailsMissing: (id: string) => void;
    markDetailsAvailable: (id: string) => void;
    hasMissingDetails: (id: string) => boolean;

    searchMode: SearchMode;
    query: string;
    results: MedicineProductResponse[];
    searched: boolean;
    setSearch: (search: {
        searchMode: SearchMode;
        query: string;
        results: MedicineProductResponse[];
        searched: boolean;
    }) => void;
}

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
            partialize: (state) => ({ missingDetailIds: state.missingDetailIds }),
        },
    ),
);

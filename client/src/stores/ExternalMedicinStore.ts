import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ExternalMedicinState {
    missingDetailIds: string[];
    markDetailsMissing: (id: string) => void;
    markDetailsAvailable: (id: string) => void;
    hasMissingDetails: (id: string) => boolean;
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
        }),
        {
            name: "external-medicin-missing-details",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

import { beforeEach, describe, expect, it } from "vitest";
import { useExternalMedicinStore } from "./ExternalMedicinStore";

const initialState = useExternalMedicinStore.getState();

describe("useExternalMedicinStore", () => {
    beforeEach(() => {
        useExternalMedicinStore.setState(initialState, true);
    });

    it("starts with no missing details", () => {
        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual([]);
        expect(useExternalMedicinStore.getState().hasMissingDetails("123")).toBe(false);
    });

    it("markDetailsMissing adds the id", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["123"]);
        expect(useExternalMedicinStore.getState().hasMissingDetails("123")).toBe(true);
    });

    it("markDetailsMissing does not add a duplicate id", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");
        useExternalMedicinStore.getState().markDetailsMissing("123");

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["123"]);
    });

    it("markDetailsMissing keeps existing ids when adding a new one", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");
        useExternalMedicinStore.getState().markDetailsMissing("456");

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["123", "456"]);
    });

    it("markDetailsAvailable removes the id", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");
        useExternalMedicinStore.getState().markDetailsMissing("456");

        useExternalMedicinStore.getState().markDetailsAvailable("123");

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["456"]);
        expect(useExternalMedicinStore.getState().hasMissingDetails("123")).toBe(false);
    });

    it("markDetailsAvailable is a no-op when the id isn't tracked", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");

        useExternalMedicinStore.getState().markDetailsAvailable("does-not-exist");

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["123"]);
    });

    it("starts with an empty, unsearched search state", () => {
        const state = useExternalMedicinStore.getState();

        expect(state.searchMode).toBe("name");
        expect(state.query).toBe("");
        expect(state.results).toEqual([]);
        expect(state.searched).toBe(false);
    });

    it("setSearch replaces the search state", () => {
        const results = [
            { navn: "Panodil", varenummer: "1", firma: "GSK", styrke: "500mg", detaljer: "d", pakning: "20 stk" },
        ];

        useExternalMedicinStore.getState().setSearch({
            searchMode: "ingredient",
            query: "paracetamol",
            results,
            searched: true,
        });

        const state = useExternalMedicinStore.getState();
        expect(state.searchMode).toBe("ingredient");
        expect(state.query).toBe("paracetamol");
        expect(state.results).toEqual(results);
        expect(state.searched).toBe(true);
    });

    it("setSearch does not affect missingDetailIds", () => {
        useExternalMedicinStore.getState().markDetailsMissing("123");

        useExternalMedicinStore.getState().setSearch({
            searchMode: "name",
            query: "ibuprofen",
            results: [],
            searched: true,
        });

        expect(useExternalMedicinStore.getState().missingDetailIds).toEqual(["123"]);
    });
});

import { apiFetch } from "../api/client";
import type { MedicineDetail } from "../entites/MedicineDetail";
import type { MedicineProduct } from "../entites/MedicineProduct";

const BASE = "/ExternalMedicinePrices";

export const medicinePriceService = {
    // GET api/ExternalMedicinePrices/productsByName?productName=...
    getByName: async (productName: string): Promise<MedicineProduct[]> => {
        const params = new URLSearchParams({ productName });
        return apiFetch<MedicineProduct[]>(`${BASE}/productsByName?${params}`);
    },

    // GET api/ExternalMedicinePrices/productsByIngredient?ingredientName=...
    getByIngredient: async (ingredientName: string): Promise<MedicineProduct[]> => {
        const params = new URLSearchParams({ ingredientName });
        return apiFetch<MedicineProduct[]>(`${BASE}/productsByIngredient?${params}`);
    },

    // GET api/ExternalMedicinePrices/productDetails?productDetailId=...
    getDetails: async (productDetailId: string): Promise<MedicineDetail> => {
        const params = new URLSearchParams({ productDetailId });
        return apiFetch<MedicineDetail>(`${BASE}/productDetails?${params}`);
    },
};

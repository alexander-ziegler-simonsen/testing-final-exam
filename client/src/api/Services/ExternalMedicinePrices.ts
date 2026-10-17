import { z } from "zod";
import { fail, http } from "../client";
import { type MedicineProductResponse, MedicineProductResponseSchema } from "../Responses/MedicineProductResponse";
import { type MedicineDetailResponse, MedicineDetailResponseSchema } from "../Responses/MedicineDetailResponse";

export const ExternalMedicinePricesService = {
  getAllByName: async (productName: string): Promise<MedicineProductResponse[]> => {
    const { data } = await http
      .get("/api/ExternalMedicinePrices/productsByName", { params: { productName } })
      .catch(fail("Failed to fetch any products by that name"));
    return z.array(MedicineProductResponseSchema).parse(data);
  },

  getAllByIngredient: async (ingredientName: string): Promise<MedicineProductResponse[]> => {
    const { data } = await http
      .get("/api/ExternalMedicinePrices/productsByIngredient", { params: { ingredientName } })
      .catch(fail("Failed to fetch any products by that ingredient"));
    return z.array(MedicineProductResponseSchema).parse(data);
  },

  productDetails: async (productDetailId: string): Promise<MedicineDetailResponse> => {
    const { data } = await http
      .get("/api/ExternalMedicinePrices/productDetails", { params: { productDetailId } })
      .catch(fail("Failed to fetch product details"));
    return MedicineDetailResponseSchema.parse(data);
  },
};

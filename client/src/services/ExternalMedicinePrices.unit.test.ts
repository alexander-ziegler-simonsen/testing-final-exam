import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Placeholders: each test passes by default until it's implemented.

describe("ExternalMedicinePricesService", () => {
    it("getAllByName returns the matching products", placeholder);
    it("getAllByName sends the name as the productName query param", placeholder);
    it("getAllByName throws \"Failed to fetch any products by that name\" when nothing matches (404)", placeholder);
    it("getAllByIngredient returns the matching products", placeholder);
    it("getAllByIngredient sends the ingredient as the ingredientName query param", placeholder);
    it("getAllByIngredient throws \"Failed to fetch any products by that ingredient\" when nothing matches (404)", placeholder);
    it("productDetails returns the product detail", placeholder);
    it("productDetails sends the id as the productDetailId query param", placeholder);
    it("productDetails throws \"Failed to fetch product details\" when the API errors", placeholder);
});

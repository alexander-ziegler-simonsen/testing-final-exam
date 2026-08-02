import {
externalMedicinePricesGetMedicineProductsByName,
externalMedicinePricesGetMedicineProductsByIngredients,
externalMedicinePricesGetMedicineProductDetails,
} from '../api';
// import {

// } from '../api/zod.gen';
import type {
ExternalMedicinePricesGetMedicineProductsByNameData,
ExternalMedicinePricesGetMedicineProductDetailsData
} from '../api';

export const ExternalMedicinePricesService = {
    getAllByName: async (productName: string): Promise<ExternalMedicinePricesGetMedicineProductsByNameData[]> =>{
        const { data, error } = await externalMedicinePricesGetMedicineProductsByName({ query: { productName } });    
        if(error) throw new Error('Failed to fetch any products by that name');
        return data;
    },

    getAllByIngredient: async (IngredientName: string): Promise<ExternalMedicinePricesGetMedicineProductsByNameData[]> =>{
        const { data, error } = await externalMedicinePricesGetMedicineProductsByIngredients({ query: { IngredientName } });
        if(error) throw new Error('Failed to fetch any products by that ingredient');
        return data;
    },

    productDetails: async (id: number): Promise<ExternalMedicinePricesGetMedicineProductDetailsData> =>{
        const { data, error } = await externalMedicinePricesGetMedicineProductDetails({ path: { id } });
if(error) throw new Error('Failed to fetch product details');
        return data;
    },
}
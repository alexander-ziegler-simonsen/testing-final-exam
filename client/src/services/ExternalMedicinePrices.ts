import {
    externalMedicinePricesGetMedicineProductsByName,
    externalMedicinePricesGetMedicineProductsByIngredients,
    externalMedicinePricesGetMedicineProductDetails,
} from '../api';
import type {
    HospitalApiDtosExternalMedicineProductOutputDto,
    HospitalApiDtosExternalMedicineDetailOutputDto,
} from '../api';

export const ExternalMedicinePricesService = {
    getAllByName: async (productName: string): Promise<HospitalApiDtosExternalMedicineProductOutputDto[]> => {
        const { data, error } = await externalMedicinePricesGetMedicineProductsByName({ query: { productName } });
        if (error) throw new Error('Failed to fetch any products by that name');
        return data;
    },

    getAllByIngredient: async (ingredientName: string): Promise<HospitalApiDtosExternalMedicineProductOutputDto[]> => {
        const { data, error } = await externalMedicinePricesGetMedicineProductsByIngredients({ query: { ingredientName } });
        if (error) throw new Error('Failed to fetch any products by that ingredient');
        return data;
    },

    productDetails: async (productDetailId: string): Promise<HospitalApiDtosExternalMedicineDetailOutputDto> => {
        const { data, error } = await externalMedicinePricesGetMedicineProductDetails({ query: { productDetailId } });
        if (error) throw new Error('Failed to fetch product details');
        return data;
    },
}
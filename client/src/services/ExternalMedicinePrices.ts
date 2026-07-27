import type { MedicineDetail } from '../entites/MedicineDetail';
import type { MedicineProduct } from '../entites/MedicineProduct';
import { api } from './Api';

const basePath = "/ExternalMedicinePrices";

export const ExternalMedicinePricesService = {
    getAllByName: (productName: string) =>
        api.get<MedicineProduct[]>(`${basePath}/productsByName/${productName}`)
            .then(r => r.data),

    getAllByIngredient: (IngredientName: string) =>
        api.get<MedicineProduct[]>(`${basePath}/productsByIngredient/${IngredientName}`)
            .then(r => r.data),

    productDetails: (id: number) =>
        api.get<MedicineDetail>(`${basePath}/productDetails/${id}`)
            .then(r => r.data),
}
import type { MedicineProduct } from '../entites/MedicineProduct';
import { api } from './Api';

const basePath = "/MedicineProduct";

export const MedicineProductService = {
    getAll: () =>
        api.get<MedicineProduct[]>(basePath)
            .then(r => r.data),

    getById: (id: number) =>
        api.get<MedicineProduct>(`${basePath}/${id}`)
            .then(r => r.data),

    create: (newMedicineProduct: MedicineProduct) =>
        api.post<MedicineProduct>(`${basePath}`, newMedicineProduct)
            .then(r => r.data),
}
import { apiFetch } from "../api/client"

export function createCrudService<T extends { id: number }, TInput = Omit<T, "id">>(base: string) {
    return {
        getAll(): Promise<T[]> {
            return apiFetch<T[]>(base)
        },
        getById(id: number): Promise<T> {
            return apiFetch<T>(`${base}/${id}`)
        },
        create(input: TInput): Promise<void> {
            return apiFetch<void>(base, { method: "POST", body: JSON.stringify({ id: 0, ...input }) })
        },
        update(id: number, input: TInput): Promise<void> {
            return apiFetch<void>(`${base}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) })
        },
        delete(id: number): Promise<void> {
            return apiFetch<void>(`${base}/${id}`, { method: "DELETE" })
        },
    }
}

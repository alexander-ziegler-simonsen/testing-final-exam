const API_BASE_URL = "http://localhost:5028/api"; // TODO - make this read from .env values

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const err = new Error(`API error: ${response.status}`) as Error & { status: number }
        err.status = response.status
        throw err
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
}
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // sends the Better Auth cookie
});

// Unwraps ApiResponse ({ data }) and turns server messages into Error.message.
// Adjust `res.data.data` if your ApiResponse shape differs.
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const res = await http.request<{ data: T }>(config);
        return res.data.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message ?? "Something went wrong");
        }
        throw err;
    }
}
import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // sends the Better Auth cookie
});

// Unwrap ApiResponse once, here, so services stay one-liners.
// Adjust `.data.data` to match your ApiResponse shape.
api.interceptors.response.use(
    (res) => res.data.data,
    (err: AxiosError<{ message?: string }>) =>
        Promise.reject(new Error(err.response?.data?.message ?? "Something went wrong"))
);
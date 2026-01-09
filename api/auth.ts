// app/api/auth.ts
import { userApi } from "./axios/axios";

export async function login({ email, password }: { email: string; password: string }) {
    const res = await userApi.post("/login2", { email, password });
    return res.data;
}

// app/api/getToken.ts
import * as SecureStore from "expo-secure-store";

export async function getToken(): Promise<string | null> {
    try {
        const token = await SecureStore.getItemAsync("userToken");
        return token;
    } catch (err) {
        console.error("Error reading token from SecureStore:", err);
        return null;
    }
}

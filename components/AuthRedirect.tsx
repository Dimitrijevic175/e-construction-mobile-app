// components/AuthRedirect.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export function AuthRedirect() {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) {
            router.replace("/login");
        }
    }, [isLoading, token]);

    return null;
}


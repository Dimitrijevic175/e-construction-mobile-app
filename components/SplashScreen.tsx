// import { SplashScreen } from 'expo-router';
// import { useAuth } from "@/providers/AuthProvider";
//
// export function SplashScreenController() {
//     const { isLoading } = useAuth();
//
//     if (!isLoading) {
//         SplashScreen.hideAsync();
//     }
//
//     return null;
// }
// components/SplashScreenController.tsx
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import { useAuth } from "@/providers/AuthProvider";

export function SplashScreenController() {
    const { isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    return null;
}



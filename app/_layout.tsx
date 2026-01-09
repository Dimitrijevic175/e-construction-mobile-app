// import { Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import "../global.css";
// import { View,Text } from "react-native";
// import { AuthProvider } from "@/providers/AuthProvider";
// import { SplashScreenController } from "@/components/SplashScreen";
//
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//
//
// // ✅ kreiramo jedan queryClient za celu aplikaciju
// const queryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//             staleTime: 1000 * 60 * 2,     // podaci važe 2 min
//             gcTime: 1000 * 60 * 10,    // čuvaju se u memoriji 10 min
//             refetchOnWindowFocus: false,
//             retry: 1,
//         },
//     },
// });
//
//
// export default function RootLayout() {
//     const [fontsLoaded] = useFonts({
//         "NunitoSans-Regular": require("../assets/fonts/NunitoSans.ttf"),
//     });
//
//     // if (!fontsLoaded) return null;
//     if (!fontsLoaded)
//         return (
//             <View className="flex-1 justify-center items-center">
//                 <Text>Loading Fonts...</Text>
//             </View>
//         );
//
//
//
//     return (
//         <QueryClientProvider client={queryClient}>
//             <AuthProvider>
//                 <SplashScreenController />
//                 <RootNavigator />
//             </AuthProvider>
//         </QueryClientProvider>
//     );
// }
//
//
// function RootNavigator() {
//     return (
//         <View className="flex-1">
//             <Stack
//                 screenOptions={{
//                     headerTitleStyle: { fontFamily: "NunitoSans-Regular" },
//                     headerShown: false,
//                 }}
//             />
//         </View>
//     );
// }
//
//
// app/_layout.tsx
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { View, Text } from "react-native";
import { AuthProvider } from "@/providers/AuthProvider";
import { SplashScreenController } from "@/components/SplashScreen";
import { AuthRedirect } from "@/components/AuthRedirect";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "NunitoSans-Regular": require("../assets/fonts/NunitoSans.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading Fonts...</Text>
            </View>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SplashScreenController />
                <AuthRedirect />
                <RootNavigator />
            </AuthProvider>
        </QueryClientProvider>
    );
}

function RootNavigator() {
    return (
        <View className="flex-1">
            <Stack
                screenOptions={{
                    headerTitleStyle: { fontFamily: "NunitoSans-Regular" },
                    headerShown: false,
                }}
            />
        </View>
    );
}



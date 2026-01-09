import { Tabs } from "expo-router";
import {Briefcase, CirclePlus, Hammer, User} from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";
import {Alert, Pressable, Text, View, Image} from "react-native";

export default function ProtectedLayout() {
    const { userData, isLoading: authLoading } = useAuth();
    const { signOut } = useAuth();

    if (authLoading || !userData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="font-nunito text-gray-500">Loading...</Text>
            </View>
        );
    }

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: () => signOut() },
        ]);
    };

    const isClient = userData.role === "ROLE_CLIENT";
    const isWorker = userData.role === "ROLE_WORKER";

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerRight: () => (
                    <Pressable
                        onPress={handleLogout}
                        className="bg-primary px-3 py-1 rounded mr-7"
                    >
                        <Text className="text-white font-nunito-bold">Logout</Text>
                    </Pressable>
                ),
                tabBarActiveTintColor: "#000",
            }}
        >
            {/* Zajednički tabovi */}
            <Tabs.Screen
                name="jobposts"
                options={{
                    headerTitle: () => (
                        <View className="flex-row items-center">
                            <Image
                                source={require("../../assets/images/MyLogo.png")}
                                className="w-8 h-8 mr-2 rounded-full"
                                resizeMode="cover"
                            />
                            <Text className="font-nunito text-primary text-lg">
                                E-Construction
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="workers"
                options={{
                    headerTitle: () => (
                        <View className="flex-row items-center">
                            <Image
                                source={require("../../assets/images/MyLogo.png")}
                                className="w-8 h-8 mr-2 rounded-full"
                                resizeMode="cover"
                            />
                            <Text className="font-nunito text-primary text-lg">
                                E-Construction
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, size }) => <Hammer color={color} size={size} />,
                }}
            />

            {/* Samo za CLIENT */}
            <Tabs.Screen
                name="createJobPost"
                options={{
                    headerTitle: () => (
                        <View className="flex-row items-center">
                            <Image
                                source={require("../../assets/images/MyLogo.png")}
                                className="w-8 h-8 mr-2 rounded-full"
                                resizeMode="cover"
                            />
                            <Text className="font-nunito text-primary text-lg">
                                E-Construction
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, size }) => <CirclePlus color={color} size={size} />,
                    href: isClient ? "/createJobPost" : null,
                }}
            />

            {/* Samo za WORKER - moraš referencirati index fajl */}
            <Tabs.Screen
                name="worker/myProfile"
                options={{
                    headerTitle: () => (
                        <View className="flex-row items-center">
                            <Image
                                source={require("../../assets/images/MyLogo.png")}
                                className="w-8 h-8 mr-2 rounded-full"
                                resizeMode="cover"
                            />
                            <Text className="font-nunito text-primary text-lg">
                                E-Construction
                            </Text>
                        </View>
                    ),
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    title: "My Profile",
                    href: isWorker ? "worker/myProfile" : null,
                }}
            />
        </Tabs>
    );
}
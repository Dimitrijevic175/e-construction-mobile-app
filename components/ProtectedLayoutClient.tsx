import { Tabs } from "expo-router";
import { Briefcase, CirclePlus, Hammer } from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";
import { Alert, Pressable, Text, View, Image } from "react-native";

export default function ProtectedLayoutClient() {
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: () => signOut() },
        ]);
    };

    const HeaderTitle = () => (
        <View className="flex-row items-center">
            <Image
                source={require("../assets/images/MyLogo.png")}
                className="w-8 h-8 mr-2 rounded-full"
                resizeMode="cover"
            />
            <Text className="font-nunito text-primary text-lg">E-Construction</Text>
        </View>
    );

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
            <Tabs.Screen
                name="jobposts"
                options={{ headerTitle: HeaderTitle, tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} /> }}
            />
            <Tabs.Screen
                name="workers"
                options={{ headerTitle: HeaderTitle, tabBarIcon: ({ color, size }) => <Hammer color={color} size={size} /> }}
            />
            <Tabs.Screen
                name="createJobPost"
                options={{ headerTitle: HeaderTitle, tabBarIcon: ({ color, size }) => <CirclePlus color={color} size={size} /> }}
            />
        </Tabs>
    );
}

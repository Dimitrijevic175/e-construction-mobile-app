import { useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
    Alert,
} from "react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useRouter } from "expo-router";
import { useAuth, UserData } from "@/providers/AuthProvider";
import { login } from "@/api/auth";
import {jwtDecode} from "jwt-decode";

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter a valid email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await login({ email, password });

            const token = response?.token;
            if (!token) throw new Error("Backend hasn't returned a token.");

            const decoded: any = jwtDecode(token);
            const role = decoded?.role;

            // Pravimo userData objekat
            const userData: UserData = {
                id: decoded?.id,
                name: decoded?.name,
                last_name: decoded?.last_name,
                email: decoded?.email,
                role: role,
                contactInfo: decoded?.contactInfo || "",
                profession: role === "ROLE_WORKER" ? decoded?.profession || "" : undefined,
            };

            // Sačuvaj token i userData u AuthProvider
            signIn(token, userData);

            // Navigacija na osnovu role
            if (role === "ROLE_CLIENT") {
                router.replace("/workers");
            } else if (role === "ROLE_WORKER") {
                router.replace("/jobposts");
            } else {
                Alert.alert("Error", "Unknown user role.");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("Error", "Wrong email or password, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className="flex-1 justify-start items-center px-6 bg-white pt-52">
                <View className="mb-6 border-4 border-primary rounded-full p-1">
                    <Image
                        source={require("../../assets/images/MyLogo.png")}
                        className="w-24 h-24 rounded-full"
                        resizeMode="cover"
                    />
                </View>

                <Text className="text-primary text-5xl mb-6 text-center font-nunito">
                    E-Construction
                </Text>

                <View className="w-full gap-y-3">
                    <Input
                        label="Email"
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label="Password"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <Button onPress={handleLogin} variant="primary" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </Button>

                <View className="flex-row mt-4">
                    <Text className="text-gray-600 font-nunito">
                        Don't have an account?{" "}
                    </Text>
                    <Link href="/register" asChild>
                        <Pressable>
                            <Text className="text-primary font-nunito font-semibold underline">
                                Register here
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


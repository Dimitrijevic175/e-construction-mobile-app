import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    TextInput,
    Modal
} from "react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {activateUser, registerClient, registerWorker, UserCreatePayload} from "@/api/api";
import { useRouter } from "expo-router";



const professions = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Moller",
    "Welder",
    "Plaster",
    "Bricklayer",
    "Ceramicist",
];

export default function Register() {
    const [userType, setUserType] = useState<"client" | "worker">("client");
    const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [email, setEmail] = useState("");

    const [activationCode, setActivationCode] = useState("");
    const [showActivationModal, setShowActivationModal] = useState(false);

    const router = useRouter();


    const handleRegister = async () => {
        if (!firstName || !lastName || !username || !password || !email || !contactInfo) {
            Alert.alert("Error", "Please fill all required fields.");
            return;
        }

        if (userType === "worker" && !selectedProfession) {
            Alert.alert("Error", "Please select a profession.");
            return;
        }

        const payload: UserCreatePayload = {
            first_name: firstName,
            last_name: lastName,
            username,
            password,
            email,
            contactInfo,
            profession: userType === "worker" ? selectedProfession! : undefined,
        };

        try {
            let res;
            if (userType === "client") {
                res = await registerClient(payload);
            } else {
                res = await registerWorker(payload);
            }

            console.log("Registered:", res);

            // Otvori modal za unos aktivacionog koda
            setShowActivationModal(true);
        } catch (err: any) {
            console.error("Registration error:", err);
            Alert.alert("Error", err?.response?.data?.message || "Failed to register.");
        }
    };

    const handleActivate = async () => {
        try {
            await activateUser(activationCode);
            Alert.alert("Success", "Your account has been activated!");
            setShowActivationModal(false);

            router.replace("/login");
        } catch (err: any) {
            console.error("Activation error:", err);
            Alert.alert("Error", err.response?.data?.message || "Activation failed");
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="font-nunito  text-3xl text-center text-primary mb-10 mt-3.5">
                        REGISTRATION
                    </Text>

                    {/* User Type Selection */}
                    <Text className="font-nunito font-bold mb-3">Are you a client or worker?</Text>
                    <View className="flex-row mb-6">
                        {["client", "worker"].map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setUserType(type as "client" | "worker")}
                                className={`flex-row items-center mr-6 ${userType === type ? "opacity-100" : "opacity-50"}`}
                            >
                                <View
                                    className={`w-5 h-5 mr-2 rounded-full border-2 ${
                                        userType === type ? "border-primary bg-primary" : "border-gray-400"
                                    } flex justify-center items-center`}
                                >
                                    {userType === type && <View className="w-3 h-3 bg-white rounded-full" />}
                                </View>
                                <Text className="font-nunito text-lg capitalize text-gray-800">{type}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <Input label="Name" placeholder="Enter your name" value={firstName} onChangeText={setFirstName} />
                        <Input label="Last Name" placeholder="Enter your last name" value={lastName} onChangeText={setLastName} />
                        <Input label="Username" placeholder="Username" value={username} onChangeText={setUsername} />
                        <Input label="Password" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                        <Input label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
                        <Input label="Contact Information" placeholder="Phone Number" value={contactInfo} onChangeText={setContactInfo} keyboardType="phone-pad"/>

                        {userType === "worker" && (
                            <>
                                <Text className="font-nunito font-bold text-gray-700 text-base mb-2">Choose your profession:</Text>
                                <FlatList
                                    data={professions}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item}
                                    contentContainerStyle={{ paddingBottom: 10 }}
                                    renderItem={({ item }) => {
                                        const selected = item === selectedProfession;
                                        return (
                                            <Pressable
                                                onPress={() => setSelectedProfession(item)}
                                                className={`mr-3 px-4 py-2 rounded-full border ${
                                                    selected ? "bg-primary border-primary" : "bg-gray-100 border-gray-300"
                                                }`}
                                            >
                                                <Text
                                                    className={`font-nunito text-sm ${selected ? "text-white" : "text-gray-700"}`}
                                                >
                                                    {item}
                                                </Text>
                                            </Pressable>
                                        );
                                    }}
                                />
                                <Input
                                    label="Contact Information"
                                    placeholder="Phone Number"
                                    value={contactInfo}
                                    onChangeText={setContactInfo}
                                    keyboardType="phone-pad"
                                />
                            </>
                        )}
                    </View>

                    <Button onPress={handleRegister} variant="primary" className="mt-8 mb-8">
                        Register
                    </Button>


                    <Modal visible={showActivationModal} transparent animationType="slide">
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="bg-white p-6 rounded-xl w-80">
                                <Text className="text-lg font-nunito-bold mb-4">Enter Activation Code</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-2 mb-4"
                                    value={activationCode}
                                    onChangeText={setActivationCode}
                                    keyboardType="numeric"
                                    placeholder="Activation code from email"
                                />
                                <Pressable
                                    className="bg-primary py-3 rounded-xl items-center"
                                    onPress={handleActivate}
                                >
                                    <Text className="text-white font-nunito-bold">Activate</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>


                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

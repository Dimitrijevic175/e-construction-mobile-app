import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import { updateWorker } from "@/api/api";
import * as ImagePicker from "expo-image-picker";
import { uploadWorkerImages } from "@/api/api";
import { Image } from "react-native";

export default function MyProfile() {
    const { userData, token, signIn } = useAuth();
    const [loading, setLoading] = useState(false);

    // inicijalizuj state sa podacima iz AuthProvider
    const [name, setName] = useState(userData?.name || "");
    const [lastName, setLastName] = useState(userData?.last_name || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [profession, setProfession] = useState(userData?.profession || "");
    const [contactInfo, setContactInfo] = useState(userData?.contactInfo || "");
    const [description, setDescription] = useState((userData as any)?.description || ""); // Worker specifično

    const [selectedImages, setSelectedImages] = useState<
        { uri: string; name: string; type: string }[]
    >([]);

    if (!userData) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>Loading user data...</Text>
            </View>
        );
    }

    const pickImages = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission required", "Gallery access is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const images = result.assets.map((asset, index) => ({
                uri: asset.uri,
                name: `worker_${userData.id}_${Date.now()}_${index}.jpg`,
                type: "image/jpeg",
            }));

            setSelectedImages(images);
        }
    };


    const handleUploadImages = async () => {
        if (selectedImages.length === 0) {
            Alert.alert("No images", "Please select images first.");
            return;
        }

        try {
            setLoading(true);

            await uploadWorkerImages(userData.id, selectedImages);

            Alert.alert("Success", "Images uploaded successfully!");
            setSelectedImages([]);
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload images.");
        } finally {
            setLoading(false);
        }
    };



    const handleUpdateProfile = async () => {
        setLoading(true);

        try {
            if (!userData) throw new Error("User data not found");

            // ✅ DODAJ OVO - proveri token
            console.log("🔑 Token:", token);
            if (!token) {
                Alert.alert("Error", "You are not authenticated. Please log in again.");
                return;
            }

            // Poziv ka backendu preko updateWorker funkcije
            const updatedWorker = await updateWorker(userData.id, {
                name,
                last_name: lastName,
                email,
                profession,
                contactInfo,
                description,
            });

            // Update AuthProvider da osveži state
            signIn(token!, {
                ...userData,
                name: updatedWorker.name,
                last_name: updatedWorker.last_name,
                email: updatedWorker.email,
                profession: updatedWorker.profession,
                contactInfo: updatedWorker.contactInfo,
                description: updatedWorker.description,
            });

            Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView className="flex-1 bg-gray-100 px-5 py-6">
            <Text className="text-2xl font-nunito-bold mb-4">My Profile</Text>

            <Text className="font-nunito mb-1">First Name</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={name}
                onChangeText={setName}
            />

            <Text className="font-nunito mb-1">Last Name</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={lastName}
                onChangeText={setLastName}
            />

            <Text className="font-nunito mb-1">Email</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text className="font-nunito mb-1">Profession</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={profession}
                onChangeText={setProfession}
            />

            <Text className="font-nunito mb-1">Contact Info</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={contactInfo}
                onChangeText={setContactInfo}
            />

            <Text className="font-nunito mb-1">Description</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <Pressable
                className="bg-primary py-3 rounded-xl items-center mt-4"
                onPress={handleUpdateProfile}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-nunito-bold text-lg">Update Profile</Text>
                )}
            </Pressable>

            <Text className="text-xl font-nunito-bold mt-8 mb-3">
                My Work Images
            </Text>

            <Pressable
                className="bg-gray-700 py-3 rounded-xl items-center mb-3"
                onPress={pickImages}
            >
                <Text className="text-white font-nunito-bold">
                    Pick Images
                </Text>
            </Pressable>

            {selectedImages.length > 0 && (
                <ScrollView horizontal className="mb-4">
                    {selectedImages.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img.uri }}
                            className="w-24 h-24 mr-2 rounded-lg"
                        />
                    ))}
                </ScrollView>
            )}

            <Pressable
                className="bg-primary py-3 rounded-xl items-center mb-10"
                onPress={handleUploadImages}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-nunito-bold text-lg">
                        Upload Images
                    </Text>
                )}
            </Pressable>



        </ScrollView>
    );
}

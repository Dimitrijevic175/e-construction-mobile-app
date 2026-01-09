import React, { useEffect, useState } from "react";
import {View, Text, Image, ActivityIndicator, ScrollView, Pressable, Linking, FlatList} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import {getWorkerById} from "@/api/api";
import {useWorker} from "@/hooks/workers/useWorker";
import {useAuth} from "@/providers/AuthProvider";
import { getWorkerImages } from "@/api/api";

export default function WorkerDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: worker, isLoading, isError } = useWorker(Number(id));
    const { userData } = useAuth();

    const [images, setImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchImages = async () => {
            try {
                setLoadingImages(true);
                const imgs = await getWorkerImages(Number(id));
                setImages(imgs);
            } catch (err) {
                console.error("Error fetching worker images:", err);
            } finally {
                setLoadingImages(false);
            }
        };

        fetchImages();
    }, [id]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="text-gray-600 mt-2 font-nunito">Loading worker...</Text>
            </View>
        );
    }

    if (isError || !worker) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500 font-nunito text-lg">Worker not found.</Text>
            </View>
        );
    }


    function WorkerImageCarousel({ images }: { images: string[] }) {
        if (!images || images.length === 0) return null;

        return (
            <FlatList
                data={images}
                keyExtractor={(item, index) => item + index}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16, borderRadius: 16 }}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{
                            width: 320,
                            height: 180,
                            marginRight: 8,
                            borderRadius: 16,
                            backgroundColor: "#E5E7EB",
                        }}
                        resizeMode="cover"
                    />
                )}
            />
        );
    }


    return (
        <ScrollView className="flex-1 bg-gray-100 px-4 pt-10">
            <StatusBar style="dark" translucent />

            {/* Gornji deo: slika + ime + profesija */}
            <View className="flex-row mb-4 items-center bg-white p-4 rounded-2xl shadow-md">
                <Image
                    source={require("../../../assets/images/worker.png")}
                    className="w-24 h-24 rounded-full mr-4"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="font-nunito font-bold text-2xl text-gray-900">
                        {worker.name} {worker.last_name}
                    </Text>
                    <Text className="font-nunito text-lg text-gray-600 mt-1">
                        {worker.profession}
                    </Text>
                </View>
            </View>

            <Text className="font-nunito font-bold text-gray-800 mb-1">Description:</Text>
            <View className="h-px bg-gray-300 my-2" />

            <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                <Text className="font-nunito text-gray-800">{worker.description}</Text>
            </View>

            <Text className="font-nunito font-bold text-gray-800 mb-1">Contact Info:</Text>
            <View className="h-px bg-gray-300 my-2" />

            <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                <Text className="font-nunito text-gray-800">📞 {worker.contactInfo}</Text>
                <Text className="font-nunito text-gray-800 mt-1">✉️ {worker.email}</Text>
            </View>

            {loadingImages ? (
                <ActivityIndicator size="small" />
            ) : images.length > 0 ? (
                <WorkerImageCarousel images={images} />
            ) : null}



            {userData?.role === "ROLE_CLIENT" && (
            <Pressable
                className="bg-green-500 p-2 rounded-md flex-row items-center justify-center"
                onPress={() => Linking.openURL(`tel:${worker.contactInfo}`)}
            >
                <Text className="font-nunito text-white font-bold">Recruit Me</Text>
            </Pressable>
            )}

        </ScrollView>
    );
}

import { View, Text, ScrollView, ActivityIndicator, Pressable, Alert, TextInput, Modal, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getClientById, setOffer } from "@/api/api";
import { useAuth } from "@/providers/AuthProvider";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useJobPost } from "@/hooks/jobPosts/useJobPost";
import {useClient} from "@/hooks/client/useClient";
import { useJobOffersByJobPostId } from "@/hooks/jobPosts/useJobOffersByJobPostId";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";


export default function JobPostDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const jobPostId = Number(id);
    const queryClient = useQueryClient();
    const router = useRouter();


    const { data: jobPost, isLoading: jobLoading, isError: jobError } = useJobPost(jobPostId);
    const clientId = jobPost?.client_id ?? 0;
    const { data: client, isLoading: clientLoading } = useClient(clientId);
    const { data: jobOffersData, isLoading: offersLoading, refetch: refetchOffers} = useJobOffersByJobPostId(jobPostId);


    const { userData } = useAuth();

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [offerDetails, setOfferDetails] = useState("");
    const [startingPrice, setStartingPrice] = useState("");

    const loading = jobLoading || clientLoading;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (jobError || !jobPost) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500 font-nunito">Job post not found.</Text>
            </View>
        );
    }

    const handleMakeOffer = async () => {
        if (!offerDetails || !startingPrice) {
            Alert.alert("Error", "Please fill in both offer details and starting price.");
            return;
        }

        if (!userData) {
            Alert.alert("Error", "User data not found.");
            return;
        }

        try {
            const payload = {
                job_post_id: jobPost.id,
                worker_id: userData.id,
                date_offered: new Date().toISOString().split("T")[0], // "YYYY-MM-DD"
                offer_details: offerDetails,
                name: userData.name,
                last_name: userData.last_name,
                profession: userData.profession || "",
                email: userData.email,
                contactInfo: userData.contactInfo || "",
                starting_price: parseFloat(startingPrice),
            };

            await setOffer(payload);

            // update query cache instantly
            queryClient.setQueryData(["jobOffers", jobPostId], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    content: [...oldData.content, payload],
                    totalElements: oldData.totalElements + 1,
                };
            });

            Alert.alert("Success", "Offer submitted successfully!");
            setModalVisible(false);
            setOfferDetails("");
            setStartingPrice("");
        } catch (error) {
            console.error("Error submitting offer:", error);
            Alert.alert("Error", "Failed to submit offer.");
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 px-5 pt-16">

            {/* Job info */}
            <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm relative">
                {/* Badge za broj offera */}
                {jobOffersData?.totalElements && jobOffersData.totalElements > 0 ? (
                    <View className="absolute top-4 right-4 bg-red-500 rounded-full px-2 py-1">
                        <Text className="text-white font-nunito-bold text-xs">
                            {jobOffersData.totalElements} {jobOffersData.totalElements === 1 ? 'offer' : 'offers'}
                        </Text>
                    </View>
                ) : null}


                <Text className="text-2xl font-nunito-bold mb-2 text-gray-800">
                    {jobPost.title}
                </Text>

                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="calendar-alt" size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 font-nunito">
                        {new Date(jobPost.date_posted).toLocaleDateString()}
                    </Text>
                </View>

                <Text className="text-gray-700 leading-6 font-nunito">
                    {jobPost.description}
                </Text>
            </View>

            {jobPost.latitude && jobPost.longitude && (
                <View className="mb-6 rounded-2xl overflow-hidden shadow-sm" style={{ height: 200 }}>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: jobPost.latitude,
                            longitude: jobPost.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: jobPost.latitude,
                                longitude: jobPost.longitude,
                            }}
                            title={jobPost.title}
                            description={jobPost.address}
                        />
                    </MapView>
                </View>
            )}


            {/* Client info */}
            {client && (
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
                    <Text className="text-xl font-nunito-bold text-gray-800 mb-2">
                        Client Information
                    </Text>

                    <View className="flex-row items-center mb-1">
                        <MaterialIcons name="person" size={18} color="#6b7280" />
                        <Text className="ml-2 text-gray-700 font-nunito">
                            {client.name} {client.last_name}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-1">
                        <MaterialIcons name="email" size={18} color="#6b7280" />
                        <Text className="ml-2 text-gray-700 font-nunito">{client.email}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <MaterialIcons name="phone" size={18} color="#6b7280" />
                        <Text className="ml-2 text-gray-700 font-nunito">
                            {client.contactInfo}
                        </Text>
                    </View>
                </View>
            )}

            {/* Make Offer Button */}
            {userData?.role === "ROLE_WORKER" && (
                <Pressable
                    className="bg-primary p-3 rounded-xl items-center mb-6"
                    onPress={() => setModalVisible(true)}
                >
                    <Text className="text-white font-nunito-bold  text-lg">Make Offer</Text>
                </Pressable>
            )}

            {/* Button za klijenta */}
            {userData?.role === "ROLE_CLIENT" && (
                <Button
                    variant="primary"
                    className="mb-6"
                    onPress={() =>
                        router.push({
                            pathname: "/jobposts/myJobOffers",
                            params: { jobPostId: jobPost.id }, // prosleđuješ jobPostId kao param
                        })
                    }
                >
                    View Offers
                </Button>

            )}

            {/* Modal for Offer */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-4">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <Text className="text-xl font-nunito-bold mb-4">Make an Offer</Text>

                        <Text className="font-nunito mb-1">Offer Details</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            multiline
                            numberOfLines={4}
                            placeholder="Enter offer details"
                            value={offerDetails}
                            onChangeText={setOfferDetails}
                        />

                        <Text className="font-nunito mb-1">Starting Price</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            placeholder="Enter starting price"
                            value={startingPrice}
                            onChangeText={setStartingPrice}
                            keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                        />

                        <Pressable
                            className="bg-primary py-2 rounded-xl mb-2 items-center"
                            onPress={handleMakeOffer}
                        >
                            <Text className="text-white font-nunito font-bold">Submit Offer</Text>
                        </Pressable>

                        <Pressable
                            className="bg-gray-300 py-2 rounded-xl items-center"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-gray-700 font-nunito font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

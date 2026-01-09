import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/Button";
import { deleteJobOffer } from "@/api/api";
import { useJobOffersByJobPostId } from "@/hooks/jobPosts/useJobOffersByJobPostId";
import { useEffect, useState } from "react";

type JobOffer = {
    id: number;
    job_post_id: number;
    worker_id: number;
    date_offered: string;
    offer_details: string;
    name: string;
    last_name: string;
    profession: string;
    email: string;
    starting_price: number;
    accepted: boolean;
};

export default function MyJobOffers() {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const { jobPostId } = useLocalSearchParams<{ jobPostId: string }>();
    const id = Number(jobPostId);

    // Dohvati offers preko hook-a
    const { data: jobOffersData, isLoading } = useJobOffersByJobPostId(id);
    const [offers, setOffers] = useState<JobOffer[]>([]);

    // Inicijalizacija lokalnog state-a iz query podataka
    useEffect(() => {
        if (jobOffersData?.content) {
            setOffers(jobOffersData.content);
        }
    }, [jobOffersData]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!offers || offers.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500 font-nunito">No offers found.</Text>
            </View>
        );
    }

    const handleAcceptOffer = (offerId: number) => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to accept this offer?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            // Optimistic update: odmah ukloni offer iz lokalnog state-a
                            setOffers(prev => prev.filter(o => o.id !== offerId));

                            // Pozovi backend da obriše offer
                            await deleteJobOffer(offerId);

                            // Invalidiraj query da se osveže badge i zavisni ekrani
                            queryClient.invalidateQueries({ queryKey: ["jobOffers", id] });


                            Alert.alert("Success", "Offer accepted and removed successfully!");
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Error", "Failed to accept/remove offer.");
                            // rollback: refetch query
                            queryClient.invalidateQueries({ queryKey: ["jobOffers", id] });
                        }
                    },
                    style: "default",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 px-5 pt-8" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-2xl font-nunito-bold text-gray-800 mb-6">Offers</Text>

            {offers.map((offer) => (
                <View key={offer.id} className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                    {/* Worker Details */}
                    <Text className="text-xl font-nunito-bold text-gray-800 mb-2">Worker Details</Text>
                    <View className="mb-2">
                        <Text className="text-gray-700 font-nunito">
                            {offer.name} {offer.last_name} ({offer.profession})
                        </Text>
                        <Text className="text-gray-500 font-nunito text-sm">{offer.email}</Text>
                    </View>

                    <Text className="text-gray-400 font-nunito text-xs mb-2">
                        Offered on: {new Date(offer.date_offered).toLocaleDateString()}
                    </Text>

                    <Text className="text-xl font-nunito-bold text-gray-800 mb-2">Offer Details</Text>
                    <Text className="text-gray-700 font-nunito mb-2">{offer.offer_details}</Text>

                    <Text className="text-gray-700 font-nunito font-semibold mb-4">
                        Starting Price: ${offer.starting_price.toFixed(2)}
                    </Text>

                    {userData?.role === "ROLE_CLIENT" && !offer.accepted && (
                        <Button variant="primary" onPress={() => handleAcceptOffer(offer.id)}>
                            Accept Offer
                        </Button>
                    )}

                    {offer.accepted && (
                        <Text className="text-green-600 font-nunito font-semibold mt-2">Offer Accepted</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

import React from "react";
import { View, Text, Image, FlatList, SafeAreaView, ActivityIndicator, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAllWorkers } from "@/hooks/workers/useAllWorkers";
import { useReviewsByWorker } from "@/hooks/workers/useReviewsByWorker";

// ------------------- StarRating -------------------
function StarRating({ rating }: { rating: number }) {
    const totalStars = 5;
    const starSize = 16; // širina i visina zvezdice

    return (
        <View style={{ flexDirection: "row", marginTop: 4 }}>
            {Array.from({ length: totalStars }).map((_, index) => {
                const starValue = index + 1;
                let fillWidth = 0;

                if (rating >= starValue) {
                    fillWidth = starSize; // puna zvezdica
                } else if (rating > index && rating < starValue) {
                    fillWidth = (rating - index) * starSize; // poluzvezdica
                } else {
                    fillWidth = 0; // prazna zvezdica
                }

                return (
                    <View
                        key={index}
                        style={{
                            width: starSize,
                            height: starSize,
                            marginRight: 2,
                            position: "relative",
                        }}
                    >
                        {/* Siva zvezdica (pozadina) */}
                        <Text style={{ color: "#D1D5DB", fontSize: starSize, position: "absolute", top: 0, left: 0 }}>
                            ★
                        </Text>

                        {/* Žuta zvezdica (preklop) */}
                        <View
                            style={{
                                overflow: "hidden",
                                width: fillWidth,
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        >
                            <Text style={{ color: "#FBBF24", fontSize: starSize }}>★</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

// ------------------- ReviewList -------------------
function ReviewList({ reviews }: { reviews: any[] }) {
    if (!reviews || reviews.length === 0) {
        return <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>No reviews yet.</Text>;
    }

    return (
        <View style={{ flexDirection: "row", marginTop: 4 }}>
            {reviews.slice(0, 3).map((r, i) => (
                <StarRating key={i} rating={r.rating} />
            ))}
        </View>
    );
}

// ------------------- WorkerCard -------------------
function WorkerCard({ worker }: { worker: any }) {
    const { data: reviews, isLoading: loadingReviews } = useReviewsByWorker(worker.id);

    return (
        <View style={{ backgroundColor: "white", padding: 16, borderRadius: 24, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Pressable onPress={() => router.push(`/workers/${worker.id}`)}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <Image
                        source={require("../../../assets/images/worker.png")}
                        style={{ width: 64, height: 64, borderRadius: 32, marginRight: 12 }}
                        resizeMode="cover"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "NunitoSans-Regular", fontWeight: "bold", fontSize: 16, color: "#111827" }}>
                            {worker.name} {worker.last_name}
                        </Text>
                        <Text style={{ fontFamily: "NunitoSans-Regular", fontSize: 14, color: "#4B5563", marginBottom: 4 }}>
                            {worker.profession || ""}
                        </Text>
                        {loadingReviews ? (
                            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Loading reviews...</Text>
                        ) : (
                            <ReviewList reviews={reviews || []} />
                        )}
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

// ------------------- WorkersScreen -------------------
export default function WorkersScreen() {
    const { data: workers, isLoading, isError } = useAllWorkers();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" }}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 8, fontSize: 14, color: "#4B5563" }}>Loading workers...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" }}>
                <Text style={{ fontSize: 16, color: "#EF4444" }}>Failed to load workers.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 16, paddingTop: 40 }}>
            <SafeAreaView style={{ backgroundColor: "white" }}>
                <StatusBar style="dark" translucent />
            </SafeAreaView>

            <FlatList
                data={workers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <WorkerCard worker={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </View>
    );
}


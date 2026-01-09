import React from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAllJobPosts } from "@/hooks/jobPosts/useAllJobPosts";
import { useAuth } from "@/providers/AuthProvider";

export default function JobPostsScreen() {
    const { data: jobPosts, isLoading, isError } = useAllJobPosts();
    const { userData } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="text-gray-600 mt-2 font-nunito">Loading job posts...</Text>
            </View>
        );
    }

    if (isError || !jobPosts) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500 font-nunito text-lg">Failed to load job posts.</Text>
            </View>
        );
    }

    // Ako je korisnik ROLE_CLIENT, filtriramo samo njegove job postove
    const filteredJobPosts =
        userData?.role === "ROLE_CLIENT"
            ? jobPosts.filter((post: any) => post.client_id === userData.id)
            : jobPosts;

    // Sortiramo po datumu opadajuće (noviji na vrhu)
    const sortedJobPosts = [...filteredJobPosts].sort(
        (a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
    );

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white p-4 rounded-2xl shadow-md mb-4 mx-1">
            <Text className="font-nunito font-bold text-lg text-gray-900">{item.title}</Text>
            <Text className="font-nunito text-gray-600 mt-1">
                🗓️ {new Date(item.date_posted).toLocaleDateString()}
            </Text>

            <Pressable
                className="bg-primary mt-3 py-2 rounded-xl items-center"
                onPress={() => router.push(`/jobposts/${item.id}`)}
            >
                <Text className="text-white font-nunito font-semibold">View Details</Text>
            </Pressable>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 px-4 pt-10">
            <StatusBar style="dark" translucent />

            <FlatList
                data={sortedJobPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </View>
    );
}

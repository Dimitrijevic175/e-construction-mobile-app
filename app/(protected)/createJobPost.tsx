import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useCreateJobPost } from "@/hooks/jobPosts/useCreateJobPost";
import { useRouter } from "expo-router";
import { format } from "date-fns";

export default function CreateJobPost() {
    const { userData } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [street, setStreet] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [city, setCity] = useState("");

    const createJobPostMutation:any = useCreateJobPost(Number(userData?.id));

    const handleCreateJobPost = async () => {
        if (!title || !description) {
            Alert.alert("Error", "Please fill in both title and description.");
            return;
        }

        if (!userData) {
            Alert.alert("Error", "User data not found.");
            return;
        }

        if (!street || !municipality || !city) {
            Alert.alert("Error", "Please fill in address, municipality and city.");
            return;
        }

        const fullAddress = `${street}, ${municipality}, ${city}`;

        const payload = {
            title,
            description,
            address: fullAddress,
            client_id: userData.id,
            date_posted: format(new Date(), "yyyy-MM-dd"),
        };

        try {
            await createJobPostMutation.mutateAsync(payload);
            Alert.alert("Success", "Job post created successfully!");

            setTitle("");
            setDescription("");

            router.back(); // vrati se na prethodni ekran
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create job post.");
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 px-5 pt-16" contentContainerStyle={{ paddingBottom: 40 }}>

            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <Text className="text-lg font-nunito-bold text-gray-800 mb-2">Title</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4 font-nunito text-gray-700"
                    placeholder="Enter job title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text className="text-lg font-nunito-bold text-gray-800 mb-2">Description</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 h-32 mb-4 font-nunito text-gray-700"
                    placeholder="Enter job description"
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text className="text-lg font-nunito-bold text-gray-800 mb-2">Street & Number</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4 font-nunito text-gray-700"
                    placeholder="Stare Ranke 1"
                    value={street}
                    onChangeText={setStreet}
                />

                <Text className="text-lg font-nunito-bold text-gray-800 mb-2">Municipality</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4 font-nunito text-gray-700"
                    placeholder="Čukarica"
                    value={municipality}
                    onChangeText={setMunicipality}
                />

                <Text className="text-lg font-nunito-bold text-gray-800 mb-2">City</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4 font-nunito text-gray-700"
                    placeholder="Beograd"
                    value={city}
                    onChangeText={setCity}
                />

                <Pressable
                    className="bg-primary py-3 rounded-xl items-center"
                    onPress={handleCreateJobPost}
                    disabled={createJobPostMutation.isLoading}
                >
                    <Text className="text-white font-nunito-bold text-lg">
                        {createJobPostMutation.isLoading ? "Creating..." : "Create Job Post"}
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

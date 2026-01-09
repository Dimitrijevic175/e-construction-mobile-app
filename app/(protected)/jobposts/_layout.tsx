import { Stack } from "expo-router";

export default function JobPostsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Jobs" }} />
            <Stack.Screen name="[id]" options={{ title: "Job Details" }} />
            <Stack.Screen name="myJobOffers" options={{ title: "Job Offers" }} />
        </Stack>
    );
}

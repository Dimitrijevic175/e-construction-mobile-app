import { Stack } from "expo-router";

export default function WorkersLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Workers" }} />
            <Stack.Screen name="[id]" options={{ title: "Worker Details" }} />
        </Stack>
    );
}

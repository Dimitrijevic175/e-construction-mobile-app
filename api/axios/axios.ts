// app/api/axios.ts
import axios from "axios";
import {getToken} from "@/api/getToken";

const userApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_USER_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const jobOffersApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_JOBOFFERS_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const jobPostsApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_JOBPOSTS_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const reviewsApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_REVIEWS_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const notificationApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_NOTIFICATION_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const defaultApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
});

[userApi, jobOffersApi, jobPostsApi, reviewsApi, notificationApi,defaultApi].forEach(api => {
    api.interceptors.request.use(async (config) => {
        if (config.url?.includes("/login") || config.url?.includes("/add-client") || config.url?.includes("/add-worker")) {
            return config;
        }

        let token = await getToken();

        // ✅ DODAJ OVO - ukloni navodike
        if (token) {
            token = token.replace(/^"|"$/g, ''); // Ukloni navodike sa početka i kraja
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        console.log("📤 Request:", config.method, config.url, config.data, config.headers);
        return config;
    });
});

// Interceptor za logovanje response-a
userApi.interceptors.response.use(
    response => {
        console.log("📥 Response:");
        console.log("   URL:", response.config.url);
        console.log("   Status:", response.status);
        console.log("   Data:", response.data);
        return response;
    },
    error => {
        if (error.response) {
            console.log("⚠️ Response Error:");
            console.log("   URL:", error.response.config.url);
            console.log("   Status:", error.response.status);
            console.log("   Data:", error.response.data);
        } else {
            console.log("⚠️ Request Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export { userApi, jobPostsApi, jobOffersApi, reviewsApi, notificationApi,defaultApi };

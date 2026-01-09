// app/api/api.ts
import {reviewsApi, userApi, jobPostsApi, jobOffersApi, defaultApi} from "@/api/axios/axios";
import {JobOfferIn} from "@/models/jobOffer";
import {JobPostIn} from "@/models/jobPost";

export interface WorkerUpdatePayload {
    name?: string;
    last_name?: string;
    email?: string;
    profession?: string;
    contactInfo?: string;
    description?: string;
}

export interface UserCreatePayload {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    profession?: string;
    contactInfo?: string;
}

export async function getAllWorkers() {
    const res = await userApi.get("/all-workers");
    return res.data.content;
}

export async function getReviewsByWorkerId(workerId: number) {
    const res = await reviewsApi.get(`/reviewed/${workerId}`);
    return res.data;
}

export async function getWorkerById(workerId: number) {
    const res = await userApi.get(`/worker/${workerId}`);
    return res.data;
}

export async function getAllJobPosts(){
    const res = await jobPostsApi.get("/all");
    return res.data;
}

export async function getJobPostById(id: number) {
    const res = await jobPostsApi.get(`/${id}`);
    return res.data;
}

export async function getClientById(id: number) {
    const res = await userApi.get(`/client/${id}`);
    return res.data;
}

export async function setOffer(offer: JobOfferIn) {
    const res = await jobOffersApi.post("", offer);
    return res.data;
}

export async function getJobOffersByJobPostId(jobPostId: number) {
    const res = await jobPostsApi.get(`/jobOffers/${jobPostId}`);
    return res.data;
}

export async function setJobOfferAccepted(jobOfferId: number, accepted: boolean) {
    const res = await jobOffersApi.put(`/${jobOfferId}/${accepted}`);
    return res.data;
}

export async function deleteJobOffer(id: number) {
    const res = await jobOffersApi.delete(`/${id}`);
    return res.data;
}

export async function createJobPost(payload: JobPostIn) {
    const res = await jobPostsApi.post("", payload);
    return res.data;
}

export async function updateWorker(workerId: number, data: WorkerUpdatePayload) {
    const res = await userApi.put(`/worker/${workerId}`, data);
    return res.data;
}

// upload worker images
export async function uploadWorkerImages(
    workerId: number,
    images: {
        uri: string;
        name: string;
        type: string;
    }[]
) {
    const formData = new FormData();

    images.forEach((image) => {
        formData.append("images", {
            uri: image.uri,
            name: image.name,
            type: image.type,
        } as any);
    });

    console.log("📦 Uploading images:", images);

    const res = await defaultApi.post(
        `/${workerId}/images`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
}

// get worker images
export async function getWorkerImages(workerId: number) {
    const res = await defaultApi.get(`/${workerId}/images`);
    // mapiramo na puni URL
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    return res.data.map((img: { imageUrl: string }) => `${baseUrl}${img.imageUrl}`);
}

export async function registerClient(payload: UserCreatePayload) {
    const res = await userApi.post("/add-client", payload);
    return res.data;
}

export async function registerWorker(payload: UserCreatePayload) {
    const res = await userApi.post("/add-worker", payload);
    return res.data;
}

export async function activateUser(code: string) {
    const res = await userApi.get(`/string${code}/activate`);
    return res.data;
}







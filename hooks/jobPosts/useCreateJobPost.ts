import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobPost } from "@/api/api";
import { JobPostIn } from "@/models/jobPost"

export const useCreateJobPost = (userId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: JobPostIn) => createJobPost(data),

        onSuccess: (newJobPost) => {
            // 1. odmah dodaj u kes
            queryClient.setQueryData(["jobPosts"], (oldData: any) => {
                if (!oldData) return [newJobPost];
                return [...oldData, newJobPost];
            });


            // 2. osveži server-synchronization
            queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
        }
    });
};

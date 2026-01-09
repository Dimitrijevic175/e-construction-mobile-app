import { useQuery } from "@tanstack/react-query";
import { getJobPostById } from "@/api/api";

export function useJobPost(jobPostId: number) {
    return useQuery({
        queryKey: ["jobPost", jobPostId],
        queryFn: () => getJobPostById(jobPostId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!jobPostId,
    });
}

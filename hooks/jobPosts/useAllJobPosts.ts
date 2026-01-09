import { useQuery } from "@tanstack/react-query";
import { getAllJobPosts } from "@/api/api";

export function useAllJobPosts() {
    return useQuery({
        queryKey: ["jobPosts"],
        queryFn: getAllJobPosts,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}

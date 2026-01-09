import { useQuery } from "@tanstack/react-query";
import { getReviewsByWorkerId } from "@/api/api";

export function useReviewsByWorker(workerId: number) {
    return useQuery({
        queryKey: ["reviews", workerId],
        queryFn: () => getReviewsByWorkerId(workerId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!workerId,
    });
}

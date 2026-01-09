import { useQuery } from "@tanstack/react-query";
import { getWorkerImages } from "@/api/api";

export function useWorkerImages(workerId: number) {
    return useQuery({
        queryKey: ["worker-images", workerId],
        queryFn: () => getWorkerImages(workerId),
        enabled: !!workerId,
    });
}

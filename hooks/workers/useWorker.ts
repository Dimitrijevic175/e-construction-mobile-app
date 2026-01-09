import { useQuery } from "@tanstack/react-query";
import { getWorkerById } from "@/api/api";

export function useWorker(workerId: number) {
    return useQuery({
        queryKey: ["worker", workerId],
        queryFn: () => getWorkerById(workerId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!workerId, // query se ne pokreće dok nema workerId
    });
}

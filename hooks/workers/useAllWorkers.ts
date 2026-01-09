import { useQuery } from "@tanstack/react-query";
import { getAllWorkers } from "@/api/api";

export function useAllWorkers() {
    return useQuery({
        queryKey: ["workers"],
        queryFn: getAllWorkers,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}

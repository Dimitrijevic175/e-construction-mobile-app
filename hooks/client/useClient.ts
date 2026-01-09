import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/api/api";

export function useClient(clientId: number) {
    return useQuery({
        queryKey: ["client", clientId],
        queryFn: () => getClientById(clientId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!clientId,
    });
}

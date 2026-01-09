import { useQuery } from "@tanstack/react-query";
import { getJobOffersByJobPostId } from "@/api/api";

export function useJobOffersByJobPostId(jobPostId: number) {
    return useQuery({
        queryKey: ["jobOffers", jobPostId],
        queryFn: () => getJobOffersByJobPostId(jobPostId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!jobPostId, // da ne šalje request dok ID nije spreman
    });
}

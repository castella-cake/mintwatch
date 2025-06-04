import { useQuery } from "@tanstack/react-query";

export function useUserVideoData(userId: number | undefined, sortKey = "registeredAt", sortOrder: "asc" | "desc" = "desc") {
    const { data: userVideoData } = useQuery({
        queryKey: ['commonsRelativeData', userId],
        queryFn: () => {
            if (!userId) throw new Error('no-userid')
            return getUserVideo(
                userId,
                sortKey,
                sortOrder,
            );;
        },
        enabled: !!userId,
    })
    return userVideoData;
}

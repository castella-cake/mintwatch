import { useQuery } from "@tanstack/react-query"

export function useUserVideoData(userId: string | number | undefined, sortKey: string = "registeredAt", sortOrder: "asc" | "desc" = "desc", selectContentType?: "long" | "short", sensitiveContents?: "mask", pageSize?: number, page?: number) {
    const { data: userVideoData } = useQuery({
        queryKey: ["userVideoData", userId, sortKey, sortOrder, selectContentType, sensitiveContents, pageSize, page],
        queryFn: () => {
            if (!userId) throw new Error("no-userid")
            return getUserVideo(
                userId,
                sortKey,
                sortOrder,
                selectContentType,
                sensitiveContents,
                pageSize,
                page,
            )
        },
        enabled: !!userId,
    })
    return userVideoData
}

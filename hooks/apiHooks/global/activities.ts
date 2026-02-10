import { useQuery } from "@tanstack/react-query"

export function useActivitiesQuery(context: "header_timeline" | "my_timeline" | `user_timeline_${number}` = "header_timeline", type: "publish" | "video" | "live" | "all" = "publish", userId?: number, isActorsQuery = false) {
    const { data: activitiesData, isLoading, error } = useQuery({
        queryKey: ["activities", context, type, userId, isActorsQuery],
        queryFn: () => {
            return getActivities(context, type, userId, isActorsQuery)
        },
    })
    return { activitiesData, isLoading, error }
}

import { useQuery } from "@tanstack/react-query"

export function useActivitiesQuery(
    context: "header_timeline" | "my_timeline" | `user_timeline_${number}` | "top_follow" = "header_timeline",
    type: "publish" | "video" | "short_video" | "live" | "all" = "publish",
    actorType?: "users" | "channels",
    userId?: number,
    isActorsQuery = false,
) {
    const { data: activitiesData, isLoading, error } = useQuery({
        queryKey: ["activities", context, type, actorType, userId, isActorsQuery],
        queryFn: () => {
            return getActivities(context, type, actorType, userId, isActorsQuery)
        },
    })
    return { activitiesData, isLoading, error }
}

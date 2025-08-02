import { FeedUnreadDataRootObject } from "@/types/FeedUnreadData"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function useFeedUnreadQuery() {
    const queryClient = useQueryClient()
    const { data: feedUnreadData } = useQuery({
        queryKey: ["unreadQuery"],
        queryFn: () => {
            return getFeedUnread()
        },
    })

    const queryFeedRead = useMutation({
        mutationFn: async (requestWith: string) => {
            return await postFeedRead(requestWith)
        },
        onSuccess: () => { setFeedUnreadData({ code: "ok", isUnread: false }) },
    })

    function setFeedUnreadData(data: FeedUnreadDataRootObject) {
        queryClient.setQueryData(["unreadQuery"], data)
    }
    return { feedUnreadData, queryFeedRead, setFeedUnreadData }
}

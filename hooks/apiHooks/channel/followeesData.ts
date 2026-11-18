import { getChannelFollowees } from "@/utils/apis/channel/followees"
import { useQuery } from "@tanstack/react-query"

export function useChannelFolloweesData() {
    const { data: channelFolloweesData, error, isLoading } = useQuery({
        queryKey: ["channelFollowees"],
        queryFn: () => {
            return getChannelFollowees()
        },
    })
    return { channelFolloweesData, error, isLoading }
}

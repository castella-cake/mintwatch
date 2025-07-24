import { useQuery } from "@tanstack/react-query"

export function useChannelVideoDAnimeLinksData(smId: string | undefined) {
    const { data: channelVideoDAnimeLinksData, isLoading } = useQuery({
        queryKey: ["channelVideoDAnimeLinksData", smId],
        queryFn: () => {
            if (!smId) throw new Error("no-smid") // 無効時には fetch させないように工夫
            return getChannelVideoDAnimeLinks(smId)
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return { channelVideoDAnimeLinksData, isLoading }
}

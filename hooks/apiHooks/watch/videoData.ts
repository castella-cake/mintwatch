import getFastVideoData from "@/utils/getVideoData"
import { useQuery } from "@tanstack/react-query"

export function useVideoDataQuery(smId: string | null) {
    const { data: videoInfo, error: errorInfo, isLoading } = useQuery({
        queryKey: ["videoData", smId],
        queryFn: () => {
            if (!smId) throw new Error("no-smid") // 無効時には fetch させないように工夫
            return getFastVideoData(smId)
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return { videoInfo, errorInfo, isLoading }
}

import { useQuery } from "@tanstack/react-query"
import { getVideoInfoLazy } from "@/utils/apis/videoInfo"
import { VideoDataLazyRootObject } from "@/types/watch/Lazy"

/**
 * 動画情報のうち、Lazy 経由で後から取得される(owner/ranking/series/waku)を返すhook。
 * Base API のレスポンスに含まれる `lazy.authKey` をキーとして、Base 取得後に発火する。
 *
 * actionTrackId は heartbeat と整合させる必要があるため Provider から渡す。
 */
export function useVideoLazyData(
    smId: string | undefined,
    authKey: string | undefined,
    actionTrackId: string,
    enabled = true,
) {
    const { data, error, isLoading } = useQuery<VideoDataLazyRootObject | undefined>({
        queryKey: ["videoLazyData", smId, authKey, actionTrackId],
        queryFn: async () => {
            if (!smId || !authKey || !actionTrackId) return undefined
            return getVideoInfoLazy(smId, {
                actionTrackId,
                keyToken: authKey,
            })
        },
        enabled: !!smId && !!authKey && !!actionTrackId && enabled,
        staleTime: 24 * 60 * 60 * 1000,
    })
    return { lazyData: data, error, isLazyLoading: isLoading }
}

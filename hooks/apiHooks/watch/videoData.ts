import getFastVideoData from "@/utils/getVideoData"
import APIError from "@/utils/classes/APIError"
import { useQuery } from "@tanstack/react-query"

export function useVideoDataQuery(smId: string | null) {
    const { data: videoInfo, error: errorInfo, isLoading } = useQuery({
        queryKey: ["videoData", smId],
        queryFn: () => {
            if (!smId) {
                // 無効な動画ID (例: /watch/sm0 など validateVideoId で弾かれるID) の場合は
                // 取得不能としてエラー状態にする。Info 側で ErrorUI が表示される。
                throw new APIError("Invalid video id.", {
                    meta: { status: 400, code: "MWINTERNALQUERY_INVALID_VIDEO_ID" },
                    data: {
                        response: {
                            isCustomError: true,
                            statusCode: 400,
                            errorCode: "MWINTERNALQUERY_INVALID_VIDEO_ID",
                            reasonCode: "MWINTERNALQUERY_INVALID_VIDEO_ID",
                            deletedMessage: null,
                            communityLink: null,
                            publishScheduledAt: null,
                            data: null,
                        },
                    },
                })
            }
            return getFastVideoData(smId)
        },
        retry: false,
    })
    return { videoInfo, errorInfo, isLoading }
}

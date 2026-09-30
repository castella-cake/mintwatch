import { createContext, createRef, ReactNode, RefObject, useContext, useEffect, useMemo } from "react"
import { useSmIdContext } from "./WatchDataContext"
import { VideoDataRootObject } from "@/types/watch/Base"
import { VideoInfo } from "@/types/watch"
import { useSetBackgroundPlayInfoContext } from "./BackgroundPlayProvider"
import { useVideoDataQuery } from "@/hooks/apiHooks/watch/videoData"
import { useVideoLazyData } from "@/hooks/apiHooks/watch/videoLazyData"
import APIError from "@/utils/classes/APIError"

const IActionTrackDataContext = createContext<string>("")

export const VideoRefContext = createContext<RefObject<HTMLVideoElement | null>>(createRef<HTMLVideoElement>())

export type VideoDataContextValue = {
    videoInfo: VideoInfo | null
    videoId: string | undefined
    rawVideoInfo: VideoDataRootObject | undefined
    errorInfo: any
}

const defaultContextValue: VideoDataContextValue = {
    videoInfo: null,
    videoId: undefined,
    rawVideoInfo: undefined,
    errorInfo: undefined,
}

const IVideoInfoContext = createContext<VideoDataContextValue>(defaultContextValue)

export function VideoDataProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext()

    const setBackgroundPlayInfo = useSetBackgroundPlayInfoContext()
    const { videoInfo, errorInfo } = useVideoDataQuery(smId)

    const baseSlices = videoInfo?.data?.response?.$watchV4?.data
    const isReady = !!baseSlices
    const authKey = baseSlices?.lazy?.authKey
    const actionTrackId = baseSlices?.client?.watchTrackId ?? ""

    // 残りのデータをLazyから取得する
    const { lazyData } = useVideoLazyData(smId, authKey, actionTrackId, isReady)

    useEffect(() => {
        if (!actionTrackId) return
        document.dispatchEvent(
            new CustomEvent("pmw_actionTrackIdGenerated", { detail: actionTrackId }),
        )
    }, [actionTrackId])

    useEffect(() => {
        if (!videoInfo || !baseSlices) return
        if (videoInfo.meta?.status !== 200) return
        const video = baseSlices.video
        if (video) {
            setBackgroundPlayInfo({
                title: video.title,
                videoId: video.id,
                thumbnailSrc: video.thumbnail.player,
            })
        } else {
            setBackgroundPlayInfo({})
        }
        document.dispatchEvent(
            new CustomEvent("pmw_videoInformationReady", {
                detail: JSON.stringify({ videoInfo, actionTrackId }),
            }),
        )
    }, [videoInfo])

    useEffect(() => {
        if (errorInfo && errorInfo instanceof APIError && errorInfo.response) {
            if (
                errorInfo.response?.meta?.status === 302
                && errorInfo.response?.meta?.code === "HTTP_302"
                && typeof errorInfo.response?.data?.location === "string"
                && URL.canParse(errorInfo.response?.data?.location)
            ) {
                const url = new URL(errorInfo.response.data.location)
                window.location.href = url.href
            }
        }
    }, [errorInfo])

    // ---- Context 値の組み立て ----
    // videoInfo は Base/Lazy の単純スプレッド。Lazy 未確定時は
    // owner/ranking/series/waku を null にして型整合させる (Nullable<WatchLazyData>)。
    const value: VideoDataContextValue = useMemo(() => {
        if (!baseSlices) return { ...defaultContextValue, errorInfo }
        const lazySlices = lazyData?.data
        return {
            videoInfo: {
                ...baseSlices,
                ...lazySlices,
            } as VideoInfo,
            videoId: baseSlices.video?.id,
            rawVideoInfo: videoInfo,
            errorInfo,
        }
    }, [baseSlices, lazyData, videoInfo, errorInfo])

    return (
        <IActionTrackDataContext.Provider value={actionTrackId}>
            <IVideoInfoContext.Provider value={value}>
                {children}
            </IVideoInfoContext.Provider>
        </IActionTrackDataContext.Provider>
    )
}

export function useActionTrackDataContext() {
    return useContext(IActionTrackDataContext)
}

export function useVideoInfoContext() {
    return useContext(IVideoInfoContext)
}

export function useVideoRefContext() {
    return useContext(VideoRefContext)
}

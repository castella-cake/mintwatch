import Hls from "hls.js"
import type { ErrorData, Level } from "hls.js"
import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import type { PreferredQuality, VideoLevelMap } from "@/utils/hlsLevelSelector"
import { buildVideoLevelMap, pickHighestLevel, pickLevelFromPreferred } from "@/utils/hlsLevelSelector"
import type { Video as VideoQuality, Audio as AudioQuality } from "@/types/watch/Base"

export type HlsLevelsMetadata = {
    levels: Level[]
    videos?: VideoQuality[]
    audios?: AudioQuality[]
    outputs?: { assetUnitNames: string[] }[]
    preferred?: PreferredQuality
}

export function useHls(
    videoRef: RefObject<HTMLVideoElement | null>,
    hlsUrl: string | undefined,
    mediaContents: {
        videos: VideoQuality[] | undefined
        audios: AudioQuality[] | undefined
    } | undefined,
    outputs: { assetUnitNames: string[] }[] | undefined,
    preferred: PreferredQuality | undefined,
    isEnabled = true,
) {
    const videos = mediaContents?.videos
    const audios = mediaContents?.audios

    const isSupportedBrowser = useMemo(() => Hls.isSupported(), [])
    const hlsRef = useRef<Hls>(null!)
    const levelMapRef = useRef<VideoLevelMap | null>(null)
    const preferredRef = useRef<PreferredQuality | undefined>(preferred)
    preferredRef.current = preferred
    const videosRef = useRef<VideoQuality[] | undefined>(videos)
    videosRef.current = videos
    const audiosRef = useRef<AudioQuality[] | undefined>(audios)
    audiosRef.current = audios
    const outputsRef = useRef<{ assetUnitNames: string[] }[] | undefined>(outputs)
    outputsRef.current = outputs

    const [error, setError] = useState<ErrorData | null>(null)
    const [isBuffering, setIsBuffering] = useState(false)

    useEffect(() => {
        if (!hlsUrl || !videoRef.current || !isEnabled) {
            if (videoRef.current) videoRef.current.src = ""
            setError(null)
            setIsBuffering(false)
            return
        }
        setError(null)
        setIsBuffering(false)

        if (isSupportedBrowser) {
            const hls = new Hls({
                debug: false,
                xhrSetup: function (xhr) {
                    xhr.withCredentials = true
                },
                fetchSetup: function (context, initParams) {
                    initParams.credentials = "include"
                    return new Request(context.url, initParams)
                },
                enableCEA708Captions: false,
            })
            hls.attachMedia(videoRef.current)
            hls.loadSource(hlsUrl)

            // manifest パース時に outputs[].assetUnitNames を権威として
            // (videoId, audioId) → level index の map を作り、
            // ユーザー設定を反映した level index で startLevel を上書きする。
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                if (videosRef.current && audiosRef.current && outputsRef.current) {
                    const map = buildVideoLevelMap(data.levels, outputsRef.current, videosRef.current, audiosRef.current)
                    levelMapRef.current = map
                    const target = preferredRef.current
                        ? pickLevelFromPreferred(map, preferredRef.current, videosRef.current)
                        : pickHighestLevel(map, videosRef.current, audiosRef.current)
                    if (target !== undefined) {
                        hls.startLevel = target
                        hls.currentLevel = target
                    }
                }
            })
            // LEVELS_UPDATED で map を再構築し、保存設定を反映した level を再適用する
            hls.on(Hls.Events.LEVELS_UPDATED, (event, data) => {
                if (videosRef.current && audiosRef.current && outputsRef.current) {
                    const map = buildVideoLevelMap(data.levels, outputsRef.current, videosRef.current, audiosRef.current)
                    levelMapRef.current = map
                    const target = preferredRef.current
                        ? pickLevelFromPreferred(map, preferredRef.current, videosRef.current)
                        : pickHighestLevel(map, videosRef.current, audiosRef.current)
                    if (target !== undefined) {
                        hls.currentLevel = target
                    }
                }
            })

            let lastMediaRecoveryAttempt = 0
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.MEDIA_ERROR && Date.now() - lastMediaRecoveryAttempt > 5000) {
                        lastMediaRecoveryAttempt = Date.now()
                        hls.recoverMediaError()
                        return
                    }
                    setError(data)
                    setIsBuffering(true)
                    return
                }
            })
            hls.on(Hls.Events.FRAG_BUFFERED, () => setIsBuffering(false))
            hls.on(Hls.Events.BUFFER_APPENDED, () => setIsBuffering(false))
            hls.on(Hls.Events.LEVEL_LOADED, () => setIsBuffering(false))
            hls.on(Hls.Events.MANIFEST_LOADED, () => setIsBuffering(false))
            hlsRef.current = hls
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = hlsUrl
        }
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
            if (videoRef.current) {
                videoRef.current.src = ""
                videoRef.current.currentTime = 0
            }
        }
    }, [hlsRef, hlsUrl, isSupportedBrowser, videoRef, isEnabled])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const onWaiting = () => {
            if (videoRef.current?.ended) return
            setIsBuffering(true)
        }
        const onPlaying = () => setIsBuffering(false)
        video.addEventListener("waiting", onWaiting)
        video.addEventListener("playing", onPlaying)
        return () => {
            video.removeEventListener("waiting", onWaiting)
            video.removeEventListener("playing", onPlaying)
        }
    }, [videoRef, hlsUrl])

    return { hlsRef, error, isBuffering, levelMapRef }
}

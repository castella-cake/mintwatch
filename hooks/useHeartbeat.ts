import { useCallback, useEffect, useRef } from "react"
import { sendVideoInfoHeartbeat } from "@/utils/apis/videoInfo"
import {
    HeartBeatAdditionalParameters,
    HeartBeatEventType,
    HeartBeatMethod,
    HeartBeatPayload,
    HeartBeatPerformance,
} from "@/types/watch/HeartBeat"
import { detectEnvironment } from "@/utils/detectEnvironment"

export type HeartbeatOptions = {
    videoId: string | undefined
    actionTrackId: string
    method: HeartBeatMethod // 会員種別
    nicosid: string
    queryParameters: Record<string, string>
    initialQueryParameters?: Record<string, string>
}

/**
 * heartbeat の start, impression, play イベント送信を管理するフック
 */
export function useHeartbeat({
    videoId,
    actionTrackId,
    method,
    nicosid,
    queryParameters,
    initialQueryParameters,
}: HeartbeatOptions) {
    const sentRef = useRef<Set<HeartBeatEventType>>(new Set())
    const perfRef = useRef<HeartBeatPerformance>(createInitialPerformance())
    const envRef = useRef(detectEnvironment())
    const nicosidRef = useRef(nicosid)
    const initialQueryRef = useRef(initialQueryParameters ?? queryParameters)
    const lastQueryRef = useRef(queryParameters)

    // 動画ID が変わったら状態リセット
    // TODO: useEffectを使用しない形に変更する(レンダー中の調整もしくはkey)
    useEffect(() => {
        sentRef.current = new Set()
        perfRef.current = createInitialPerformance()
        nicosidRef.current = nicosid
        initialQueryRef.current = initialQueryParameters ?? queryParameters
        lastQueryRef.current = queryParameters
    }, [videoId, nicosid])

    /**
     * performance.now() ベースの基準時刻を記録するヘルパ。
     * heartbeat payload は Unix エポックミリ秒を要求するため、
     * Date.now() で取得した絶対時刻を保存する。
     */
    const markPerformance = useCallback(<K extends keyof HeartBeatPerformance>(key: K, value: HeartBeatPerformance[K]) => {
        perfRef.current = { ...perfRef.current, [key]: value }
    }, [])

    const sendEvent = useCallback((eventType: HeartBeatEventType) => {
        if (!videoId) return
        if (sentRef.current.has(eventType)) return
        sentRef.current.add(eventType)

        const env = envRef.current
        const perf = perfRef.current
        // ほとんどはアクセス分析だと思うので今はほとんどハードコードする
        const additionalParameters: HeartBeatAdditionalParameters = {
            ___pc_v: 1,
            os: env.os,
            os_version: env.osVersion,
            nicosid: nicosidRef.current,
            referer: typeof location !== "undefined" ? location.href : "",
            query_parameters: lastQueryRef.current,
            initial_query_parameters: initialQueryRef.current,
            is_ad_block: false,
            is_ad_block_by_as: false,
            is_as_applied: false,
            has_playlist: false,
            abw_show: false,
            abw_closed: false,
            abw_seen_at: null,
            viewing_source: "",
            viewing_source_detail: {},
            playback_rate: "1",
            use_flip: false,
            quality: [],
            auto_quality: [],
            audio_quality: [],
            loop_count: 0,
            suspend_count: 0,
            load_failed: false,
            preview_play: false,
            preview_time: 0,
            preview_mute: false,
            error_description: [],
            end_position_milliseconds: null,
            hot_scene_wave: true,
            seekbar_seek_count: 0,
            performance: perf,
        }

        const payload: HeartBeatPayload = {
            actionTrackId,
            heartbeat: {
                method: method,
                params: {
                    eventType,
                    eventOccurredAt: new Date().toISOString(),
                    watchMilliseconds: 0,
                    endCount: 0,
                    additionalParameters,
                },
            },
        }
        try {
            sendVideoInfoHeartbeat(videoId, payload)
        } catch (e) {
            console.warn("WatchAPI Heartbeat failed: ", e)
        }
    }, [videoId, actionTrackId, method])

    return {
        sendStart: useCallback(() => sendEvent("start"), [sendEvent]),
        sendImpression: useCallback(() => sendEvent("impression"), [sendEvent]),
        sendPlay: useCallback(() => sendEvent("play"), [sendEvent]),
        markPerformance,
        isSent: useCallback((eventType: HeartBeatEventType) => sentRef.current.has(eventType), []),
    }
}

function createInitialPerformance(): HeartBeatPerformance {
    const now = Date.now()
    return {
        watch_access_start: now,
        watch_access_finish: null,
        video_loading_start: now,
        video_loading_finish: null,
        video_play_start: null,
        end_context: {
            ad_playing: false,
            video_playing: false,
            is_suspending: false,
        },
    }
}

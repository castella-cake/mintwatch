/**
 * heartbeat を送った後に返ってくるレスポンス。
 * HLS URL の更新情報などが返るため、必要に応じてメディア側を更新する想定。
 * 現状はレスポンスを使用しないが、型定義は残しておく。
 */
export interface VideoDataHeartBeatRootObject extends baseResponse {
    data: HeartBeatData
}

interface HeartBeatData {
    responseType: string
    media: HeartBeatMedia
}

interface HeartBeatMedia {
    hls: Hls
}

interface Hls {
    url: string
    outputs: any[]
    createdAt: string
    expiredAt: string
}

/** heartbeat の eventType */
export type HeartBeatEventType = "start" | "impression" | "play" | "pause" | "seek" | "end" | "error" | "suspend"

/** heartbeat の method */
export type HeartBeatMethod = "premium" | "regular" | "guest"

/**
 * heartbeat イベント送信時のペイロード
 * `https://nvapi.nicovideo.jp/v4/watch/{videoId}` に対して POST で送る。
 */
export interface HeartBeatPayload {
    actionTrackId: string
    heartbeat: {
        method: HeartBeatMethod
        params: HeartBeatParams
    }
}

export interface HeartBeatParams {
    eventType: HeartBeatEventType
    /** ISO 8601 形式 */
    eventOccurredAt: string
    watchMilliseconds: number
    endCount: number
    additionalParameters: HeartBeatAdditionalParameters
}

export interface HeartBeatAdditionalParameters {
    ___pc_v: number
    os: string
    os_version: string
    nicosid: string
    referer: string
    query_parameters: Record<string, string>
    initial_query_parameters: Record<string, string>
    is_ad_block: boolean
    is_ad_block_by_as: boolean
    is_as_applied: boolean
    has_playlist: boolean
    abw_show: boolean
    abw_closed: boolean
    abw_seen_at: string | null
    viewing_source: string
    viewing_source_detail: Record<string, unknown>
    playback_rate: string
    use_flip: boolean
    quality: string[]
    auto_quality: string[]
    audio_quality: string[]
    loop_count: number
    suspend_count: number
    load_failed: boolean
    preview_play: boolean
    preview_time: number
    preview_mute: boolean
    error_description: string[]
    end_position_milliseconds: number | null
    hot_scene_wave: boolean
    seekbar_seek_count: number
    performance: HeartBeatPerformance
}

export interface HeartBeatPerformance {
    watch_access_start: number
    watch_access_finish: number | null
    video_loading_start: number
    video_loading_finish: number | null
    video_play_start: number | null
    end_context: HeartBeatEndContext
}

export interface HeartBeatEndContext {
    ad_playing: boolean
    video_playing: boolean
    is_suspending: boolean
}

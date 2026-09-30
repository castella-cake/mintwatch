import type { Level } from "hls.js"
import type { Video as VideoQuality, Audio as AudioQuality } from "@/types/watch/Base"

/**
 * ユーザー設定として永続化する画質設定。
 *
 * 旧 `preferredLevel: number` (HLS インデックス) は API 仕様変更で
 * 動画ごとにインデックスが安定しないため廃止し、API レスポンス内の
 * `media.contents.{videos,audios}[*].id` で識別する。
 */
export interface PreferredQuality {
    videoId: string
    audioId: string
}

/**
 * HLS Level 配列と API の `media.hls.outputs[].assetUnitNames` から構築する lookup。
 *
 * Niconico の HLS は (video × audio) の cartesian product が
 * `media.hls.outputs[].assetUnitNames` に宣言されており、その順序がそのまま
 * m3u8 variant (= `hlsLevels[i]`) に対応する。
 * `assetUnitNames[0]` / `[1]` は `contents.videos[k].id` / `contents.audios[k].id`
 * と同一の文字列で、対応する level index を直接引ける。
 */
export interface VideoLevelMap {
    /** videoId -> その videoId での最高音質の HLS level index (UI表示用) */
    byVideo: Map<string, number>
    /** HLS level index -> { videoId, audioId } (詳細解決用) */
    byLevel: Map<number, { videoId: string, audioId: string }>
    /** (videoId, audioId) -> HLS level index (保存設定の正確な解決用) */
    byPair: Map<string, number>
}

/** `media.hls.outputs[i]` の最小限の型(テスト/関数引数の依存を局所化するため) */
export interface HlsOutputLike {
    assetUnitNames: string[]
}

export function buildVideoLevelMap(
    hlsLevels: Level[],
    hlsOutputs: HlsOutputLike[],
    videos: VideoQuality[],
    audios: AudioQuality[],
): VideoLevelMap {
    const byLevel = new Map<number, { videoId: string, audioId: string }>()
    const byPair = new Map<string, number>()

    // outputs[i] は hlsLevels[i] に対応する (Niconico はこの順序で master playlist を生成する)
    const levelCount = Math.min(hlsLevels.length, hlsOutputs.length)
    for (let i = 0; i < levelCount; i++) {
        const names = hlsOutputs[i].assetUnitNames
        if (!Array.isArray(names) || names.length < 2) continue
        const videoAsset = names[0]
        const audioAsset = names[1]
        if (!videoAsset || !audioAsset) continue
        const video = videos.find(v => v.id === videoAsset)
        const audio = audios.find(a => a.id === audioAsset)
        if (!video || !audio) continue
        // アカウントで利用不可 (premium 限定など) は除外
        if (!video.isAvailable || !audio.isAvailable) continue
        byLevel.set(i, { videoId: video.id, audioId: audio.id })
        byPair.set(pairKey(video.id, audio.id), i)
    }

    // 各 videoId について、最高音質 (audio bitrate 最大) の level を 1件選ぶ
    const byVideo = new Map<string, number>()
    for (const [levelIdx, pairInfo] of byLevel.entries()) {
        const audio = audios.find(a => a.id === pairInfo.audioId)
        if (!audio) continue
        const prevIdx = byVideo.get(pairInfo.videoId)
        if (prevIdx === undefined) {
            byVideo.set(pairInfo.videoId, levelIdx)
            continue
        }
        const prevInfo = byLevel.get(prevIdx)
        const prevAudio = prevInfo ? audios.find(a => a.id === prevInfo.audioId) : undefined
        const prevBitrate = prevAudio?.bitRate ?? 0
        if (audio.bitRate > prevBitrate) {
            byVideo.set(pairInfo.videoId, levelIdx)
        }
    }

    return { byVideo, byLevel, byPair }
}

/**
 * 保存された `PreferredQuality` から HLS level index を選ぶ。
 *
 * 優先順位:
 *   1. 完全一致 (videoId, audioId)
 *   2. videoId 一致 → その動画での最高音質 (audio は動画に紐付く最高音質へ更新)
 *   3. 最も近い qualityLevel の動画 → その最高音質
 *   4. 該当なし → undefined (呼び出し側で Auto にフォールバック)
 */
export function pickLevelFromPreferred(
    map: VideoLevelMap,
    preferred: PreferredQuality,
    videos: VideoQuality[],
): number | undefined {
    // 1. 完全一致
    const exactKey = pairKey(preferred.videoId, preferred.audioId)
    if (map.byPair.has(exactKey)) {
        return map.byPair.get(exactKey)
    }

    // 2. videoId 一致 (audio は動画に紐付く最高音質へ更新)
    const sameVideo = map.byVideo.get(preferred.videoId)
    if (sameVideo !== undefined) {
        return sameVideo
    }

    // 3. 最も近い qualityLevel の動画
    const savedVideo = videos.find(v => v.id === preferred.videoId)
    if (savedVideo) {
        const availableIds = new Set(map.byVideo.keys())
        const candidates = videos.filter(v => v.isAvailable && availableIds.has(v.id))
        if (candidates.length > 0) {
            let closest = candidates[0]
            let closestDelta = Math.abs(closest.qualityLevel - savedVideo.qualityLevel)
            for (let i = 1; i < candidates.length; i++) {
                const curr = candidates[i]
                const delta = Math.abs(curr.qualityLevel - savedVideo.qualityLevel)
                if (delta < closestDelta) {
                    closest = curr
                    closestDelta = delta
                }
            }
            const level = map.byVideo.get(closest.id)
            if (level !== undefined) return level
        }
    }

    return undefined
}

/**
 * 「未保存」の場合に選ぶ最高 level index。
 *
 * qualityLevel が最も高い動画の中での最も audio bitrate が高い組み合わせを返す。
 * 出力は存在するのに `videos` / `audios` が未確定 (まだロード中) の場合は undefined。
 */
export function pickHighestLevel(
    map: VideoLevelMap,
    videos: VideoQuality[],
    audios: AudioQuality[],
): number | undefined {
    let bestLevel: number | undefined
    let bestVideoQuality = -Infinity
    let bestAudioBitrate = -Infinity
    for (const [videoId, levelIdx] of map.byVideo.entries()) {
        const video = videos.find(v => v.id === videoId)
        if (!video) continue
        const info = map.byLevel.get(levelIdx)
        const audio = info ? audios.find(a => a.id === info.audioId) : undefined
        const audioBitrate = audio?.bitRate ?? 0
        if (
            video.qualityLevel > bestVideoQuality
            || (video.qualityLevel === bestVideoQuality && audioBitrate > bestAudioBitrate)
        ) {
            bestVideoQuality = video.qualityLevel
            bestAudioBitrate = audioBitrate
            bestLevel = levelIdx
        }
    }
    return bestLevel
}

/**
 * 指定した動画に対して、その動画とアカウントで利用可能な最高音質の audioId を返す。
 *
 * ユーザー選択時に保存する `PreferredQuality.audioId` を決定するために使う。
 */
export function pickBestAudioForVideo(
    audios: AudioQuality[],
): string | undefined {
    let best: AudioQuality | undefined
    for (const audio of audios) {
        if (!audio.isAvailable) continue
        if (!best || audio.bitRate > best.bitRate) {
            best = audio
        }
    }
    return best?.id
}

function pairKey(videoId: string, audioId: string): string {
    return `${videoId}|${audioId}`
}

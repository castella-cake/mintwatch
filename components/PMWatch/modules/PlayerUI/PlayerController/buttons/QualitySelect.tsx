import { useEffect, useState } from "react"
import type { RefObject } from "react"
import Hls, { Level } from "hls.js"
import type { Video as VideoQualityType, Audio as AudioQualityType } from "@/types/watch/Base"
import {
    buildVideoLevelOptions,
    pickBestAudioForVideo,
    type PreferredQuality,
    type VideoLevelMap,
} from "@/utils/hlsLevelSelector"

type QualitySelectProps = {
    hlsRef: RefObject<Hls>
    videos: VideoQualityType[] | undefined
    audios: AudioQualityType[] | undefined
    levelMapRef: RefObject<VideoLevelMap | null>
}

/**
 * 画質選択セレクトボックス
 *
 * v4/watch では HLS level が (video × audio) の組み合わせになったため、
 * 保存形式を `preferredLevel: number` から
 * `preferredQuality: { videoId, audioId }` に変更した。
 *
 * UI 表示は「media.contents.videos の label」、option value は HLS level index。
 * 各 video につき最高音質の level 1件だけを表示する。
 *
 * 音質は UI では触らず、保存時は利用可能な最高音質 (`pickBestAudioForVideo`) を選ぶ。
 * Auto (-1) を選んだ場合は保存値をクリアし、次回ロード時に
 * 「未保存 → 最高レベル」のフローに乗せる。
 */
export function QualitySelect({ hlsRef, videos, audios, levelMapRef }: QualitySelectProps) {
    const [hlsLevelList, setHlsLevelList] = useState<Level[]>([])
    const [hlsLevel, setHlsLevel] = useState(-1)

    useEffect(() => {
        if (!hlsRef.current) return
        setHlsLevelList(hlsRef.current.levels)
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            setHlsLevel(data.level)
        })
        hlsRef.current.on(Hls.Events.LEVELS_UPDATED, (event, data) => {
            setHlsLevelList(data.levels)
        })
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            setHlsLevelList(data.levels)
        })
    }, [hlsRef.current])

    // 各 video につき最高音質の hls level を 1件だけ表示する
    const options = computeVideoOptions(hlsLevelList, videos, levelMapRef.current)

    return hlsRef.current
        ? (
                <select
                    onChange={(e) => {
                        if (!hlsRef.current) return
                        const level = Number(e.currentTarget.value)
                        hlsRef.current.currentLevel = level
                        setHlsLevel(level)
                        if (level === -1) {
                            // Auto: 保存値があればクリアして「未保存」状態にする
                            storage.removeItem("local:preferredQuality")
                        } else {
                            // 選択 level に対応する videoId を引き、その動画で利用可能な
                            // 最高音質を audioId として保存する (UI では audio を選ばせない)
                            const map = levelMapRef.current
                            const info = map?.byLevel.get(level)
                            if (map && info) {
                                const bestAudioId = pickBestAudioForVideo(audios ?? [])
                                if (bestAudioId) {
                                    storage.setItem("local:preferredQuality", { videoId: info.videoId, audioId: bestAudioId })
                                }
                            }
                        }
                    }}
                    value={hlsLevel}
                    className="playercontroller-qualityselect"
                    aria-label="画質選択"
                    title="画質選択"
                    id="pmw-qualityselector"
                >
                    {options.map((opt) => {
                        return <option value={opt.level} key={opt.level}>{opt.label}</option>
                    })}
                    <option value={-1}>Auto</option>
                </select>
            )
        : <select className="playercontroller-qualityselect" title="画質選択" id="pmw-qualityselector" />
}

/**
 * API 提供の video ラベル(media.contents.videos)を UI 順(高さ降順)に並べ、
 * 各 videoId について最高音質の hls level を value として返す。
 *
 * byVideo map がまだ構築されていない場合(levelMapRef.current === null)は
 * hls.levels から高さで重複排除した暫定リストを返す。
 */
function computeVideoOptions(
    levels: Level[],
    videos: VideoQualityType[] | undefined,
    map: VideoLevelMap | null,
): Array<{ level: number, label: string }> {
    if (!videos || videos.length === 0) {
        // map 未構築時: hls.levels から高さで重複排除
        const seen = new Set<number>()
        const out: Array<{ level: number, label: string }> = []
        levels.forEach((l, i) => {
            if (seen.has(l.height)) return
            seen.add(l.height)
            out.push({ level: i, label: `${l.height}p` })
        })
        return out.sort((a, b) => {
            const ah = Number(a.label.replace("p", "")) || 0
            const bh = Number(b.label.replace("p", "")) || 0
            return bh - ah
        })
    }
    if (!map) return []

    return buildVideoLevelOptions(videos, map)
}

// 外部 (テスト等) から参照できるよう export する。
// tsconfig の noUnusedLocals により未使用の非 export 関数は TS6133 になるため。
export function derivePreferredFromLevel(
    level: number,
    map: VideoLevelMap | null,
): PreferredQuality | null {
    if (!map) return null
    const info = map.byLevel.get(level)
    if (!info) return null
    return { videoId: info.videoId, audioId: info.audioId }
}

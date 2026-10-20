import type { Video, Audio } from "@/types/watch/Base"
import { returnGreatestQuality } from "@/utils/domandUtils"

/**
 * access-rights API (hls) へ送る outputs を構築する。
 * `outputs[i]` は `[videoId, audioId]` の組で、access-rights から得た HLS URL の
 * master playlist と `Hls.outputs[].assetUnitNames` の対応付けに使われる。
 *
 * 音声は利用可能な中で最も良いもの1つを全ての画質に割り当てる。
 *
 * @param videos 動画情報の `media.contents.videos`
 * @param audios 動画情報の `media.contents.audios`
 */
export function buildHlsOutputs(videos: Video[], audios: Audio[]): string[][] {
    const greatestAudio = returnGreatestQuality(audios)
    if (!greatestAudio) throw new Error("audioQualityIsNotAvailable")
    return videos.filter(video => video.isAvailable).map(video => [video.id, greatestAudio.id])
}

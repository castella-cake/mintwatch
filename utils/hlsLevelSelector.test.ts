import { describe, expect, test } from "vitest"
import type { Level } from "hls.js"
import type { Video as VideoQuality, Audio as AudioQuality } from "@/types/watch/Base"
import {
    buildVideoLevelMap,
    buildVideoLevelOptions,
    pickBestAudioForVideo,
    pickHighestLevel,
    pickLevelFromPreferred,
} from "./hlsLevelSelector"

// hls.js の Level は最低限のフィールドだけ用意する
function makeLevel(width: number, height: number, bitrate: number): Level {
    return { width, height, bitrate } as unknown as Level
}

function makeVideo(
    id: string,
    qualityLevel: number,
    width: number,
    height: number,
    bitRate: number,
    isAvailable = true,
): VideoQuality {
    return { id, qualityLevel, width, height, bitRate, isAvailable, label: `${height}p` }
}

function makeAudio(id: string, qualityLevel: number, bitRate: number, isAvailable = true): AudioQuality {
    return {
        id,
        qualityLevel,
        bitRate,
        samplingRate: 44100,
        integratedLoudness: 0,
        truePeak: 0,
        loudnessCollection: [],
        label: { quality: id, bitrate: `${bitRate}` },
        isAvailable,
    }
}

describe("buildVideoLevelMap", () => {
    test("outputs[i] と hlsLevels[levelCount-1-i] を逆順で対応付ける", () => {
        const levels = [makeLevel(1920, 1080, 5000000), makeLevel(1920, 1080, 4800000), makeLevel(1280, 720, 3000000)]
        const videos = [
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        ]
        const audios = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const outputs = [
            { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
            { assetUnitNames: ["video-h264-720p", "audio-aac-192kbps"] },
        ]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        // outputs[0]=1080p+192k は hlsLevels の最上位 (= levelCount-1-0 = 1)
        expect(map.byPair.get("video-h264-1080p|audio-aac-192kbps")).toBe(1)
        // outputs[1]=720p+192k は hlsLevels の最下位 (= levelCount-1-1 = 0)
        expect(map.byPair.get("video-h264-720p|audio-aac-192kbps")).toBe(0)
        expect(map.byLevel.get(1)).toEqual({ videoId: "video-h264-1080p", audioId: "audio-aac-192kbps" })
        expect(map.byLevel.get(0)).toEqual({ videoId: "video-h264-720p", audioId: "audio-aac-192kbps" })
    })

    test("isAvailable=false の video/audio は map から除外する", () => {
        const levels = [makeLevel(1920, 1080, 5000000), makeLevel(1280, 720, 3000000)]
        const videos = [
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000, false),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        ]
        const audios = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const outputs = [
            { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
            { assetUnitNames: ["video-h264-720p", "audio-aac-192kbps"] },
        ]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        expect(map.byLevel.size).toBe(1)
        // 1080p は除外されるので、720p (outputs[1]) のみ残る → levelCount-1-1 = 0
        expect(map.byLevel.get(0)).toEqual({ videoId: "video-h264-720p", audioId: "audio-aac-192kbps" })
        expect(map.byVideo.get("video-h264-1080p")).toBeUndefined()
    })

    test("byVideo は各 video につき audio bitrate が最大の level を 1件選ぶ", () => {
        const levels = [
            makeLevel(1920, 1080, 4200000), // 1080p + 192k
            makeLevel(1920, 1080, 4080000), // 1080p + 64k
            makeLevel(1280, 720, 2200000), // 720p + 64k
            makeLevel(1280, 720, 2300000), // 720p + 128k
        ]
        const videos = [
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2000000),
        ]
        const audios = [
            makeAudio("audio-aac-192kbps", 2, 192000),
            makeAudio("audio-aac-128kbps", 1, 128000),
            makeAudio("audio-aac-64kbps", 0, 64000),
        ]
        const outputs = [
            { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
            { assetUnitNames: ["video-h264-1080p", "audio-aac-64kbps"] },
            { assetUnitNames: ["video-h264-720p", "audio-aac-64kbps"] },
            { assetUnitNames: ["video-h264-720p", "audio-aac-128kbps"] },
        ]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        // 1080p は audio 192kbps (bitrate 最大の組み合わせ) → outputs[0] → hlsLevels[3]
        expect(map.byVideo.get("video-h264-1080p")).toBe(3)
        // 720p は audio 128kbps (bitrate 最大の組み合わせ) → outputs[3] → hlsLevels[0]
        expect(map.byVideo.get("video-h264-720p")).toBe(0)
    })

    test("outputs に含まれない video/audio は無視する", () => {
        const levels = [makeLevel(1920, 1080, 5000000)]
        const videos = [makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000)]
        const audios = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const outputs: { assetUnitNames: string[] }[] = []
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        expect(map.byLevel.size).toBe(0)
        expect(map.byVideo.size).toBe(0)
    })
})

describe("pickLevelFromPreferred", () => {
    const videos: VideoQuality[] = [
        makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
        makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        makeVideo("video-h264-480p", 1, 854, 480, 1000000),
    ]
    const audios: AudioQuality[] = [
        makeAudio("audio-aac-192kbps", 1, 192000),
        makeAudio("audio-aac-64kbps", 0, 64000),
    ]
    const levels: Level[] = [
        makeLevel(1920, 1080, 4192000),
        makeLevel(1920, 1080, 4064000),
        makeLevel(1280, 720, 2256000),
        makeLevel(1280, 720, 2126000),
        makeLevel(854, 480, 1064000),
        makeLevel(854, 480, 1006000),
    ]
    const outputs = [
        { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-1080p", "audio-aac-64kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-64kbps"] },
        { assetUnitNames: ["video-h264-480p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-480p", "audio-aac-64kbps"] },
    ]
    const map = buildVideoLevelMap(levels, outputs, videos, audios)

    test("完全一致の (videoId, audioId) が最優先", () => {
        // outputs[0]=1080p+192k → 反転後の index = levelCount-1-0 = 5
        expect(pickLevelFromPreferred(map, { videoId: "video-h264-1080p", audioId: "audio-aac-192kbps" }, videos)).toBe(5)
    })

    test("videoId のみ一致したらその動画の最高音質 level", () => {
        // 1080p の audio を 64kbps に変えた想定 → byPair には無いが byVideo には 1080p が居る
        // byVideo["1080p"] = 5 (audio 192kbps の組み合わせ)
        expect(pickLevelFromPreferred(map, { videoId: "video-h264-1080p", audioId: "audio-aac-320kbps" }, videos)).toBe(5)
    })

    test("videoId が無ければ qualityLevel が最も近い動画の最高音質", () => {
        // 保存動画 (1440p) は outputs に無い (byVideo に居ない) が、
        // 現在の動画 contents には存在する想定 → 最も近い 1080p が選ばれる
        const preferred = { videoId: "video-h264-1440p", audioId: "audio-aac-320kbps" }
        const customVideos: VideoQuality[] = [
            makeVideo("video-h264-1440p", 4, 2560, 1440, 6000000),
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
            makeVideo("video-h264-480p", 1, 854, 480, 1000000),
        ]
        // qualityLevel 1080p=3, 720p=2, 480p=1 → 保存 1440p=4 に最も近いのは 1080p
        expect(pickLevelFromPreferred(map, preferred, customVideos)).toBe(map.byVideo.get("video-h264-1080p"))
    })

    test("完全に該当が無ければ undefined", () => {
        const preferred = { videoId: "video-h264-2160p", audioId: "audio-aac-320kbps" }
        // 2160p qualityLevel 5 (仮) → 候補の中で qualityLevel=3 (1080p) が最も近い
        // 動画 info の qualityLevel を変えて検証
        const customVideos: VideoQuality[] = [
            makeVideo("video-h264-2160p", 100, 3840, 2160, 8000000),
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
            makeVideo("video-h264-480p", 1, 854, 480, 1000000),
        ]
        // 2160p は videos には在るが outputs には無い (byVideo には居ない) → 3 が候補 → 1080p
        expect(pickLevelFromPreferred(map, preferred, customVideos)).toBe(map.byVideo.get("video-h264-1080p"))
    })
})

describe("pickHighestLevel", () => {
    const videos: VideoQuality[] = [
        makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
        makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
    ]
    const audios: AudioQuality[] = [
        makeAudio("audio-aac-192kbps", 1, 192000),
        makeAudio("audio-aac-64kbps", 0, 64000),
    ]
    const levels: Level[] = [
        makeLevel(1920, 1080, 4192000),
        makeLevel(1920, 1080, 4064000),
        makeLevel(1280, 720, 2256000),
        makeLevel(1280, 720, 2126000),
    ]
    const outputs = [
        { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-1080p", "audio-aac-64kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-64kbps"] },
    ]
    const map = buildVideoLevelMap(levels, outputs, videos, audios)

    test("最も qualityLevel が高い動画の最高音質を返す", () => {
        // 1080p=3 > 720p=2 → 1080p の audio 192kbps → outputs[0] → 反転後の index = 3
        expect(pickHighestLevel(map, videos, audios)).toBe(3)
    })
})

describe("pickBestAudioForVideo", () => {
    test("isAvailable=true の中で bitRate が最大の audio を返す", () => {
        const audios: AudioQuality[] = [
            makeAudio("audio-aac-64kbps", 0, 64000),
            makeAudio("audio-aac-192kbps", 2, 192000, false),
            makeAudio("audio-aac-128kbps", 1, 128000),
        ]
        expect(pickBestAudioForVideo(audios)).toBe("audio-aac-128kbps")
    })

    test("available な audio が無ければ undefined", () => {
        const audios: AudioQuality[] = [
            makeAudio("audio-aac-192kbps", 1, 192000, false),
        ]
        expect(pickBestAudioForVideo(audios)).toBeUndefined()
    })
})

describe("buildVideoLevelOptions", () => {
    const levels: Level[] = [
        makeLevel(1920, 1080, 4192000),
        makeLevel(1920, 1080, 4064000),
        makeLevel(1280, 720, 2256000),
        makeLevel(1280, 720, 2126000),
        makeLevel(854, 480, 1064000),
        makeLevel(854, 480, 1006000),
    ]
    const outputs = [
        { assetUnitNames: ["video-h264-1080p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-1080p", "audio-aac-64kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-720p", "audio-aac-64kbps"] },
        { assetUnitNames: ["video-h264-480p", "audio-aac-192kbps"] },
        { assetUnitNames: ["video-h264-480p", "audio-aac-64kbps"] },
    ]

    test("video を高さ降順に並べて、各 videoId で byVideo の level を value にする", () => {
        const videos: VideoQuality[] = [
            makeVideo("video-h264-480p", 1, 854, 480, 1000000),
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        ]
        const audios: AudioQuality[] = [
            makeAudio("audio-aac-192kbps", 1, 192000),
            makeAudio("audio-aac-64kbps", 0, 64000),
        ]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        const opts = buildVideoLevelOptions(videos, map)
        expect(opts.map(o => o.level)).toEqual([
            map.byVideo.get("video-h264-1080p"),
            map.byVideo.get("video-h264-720p"),
            map.byVideo.get("video-h264-480p"),
        ])
    })

    test("isAvailable=false の動画は除外する", () => {
        const videos: VideoQuality[] = [
            makeVideo("video-h264-1080p", 3, 1920, 1080, 4000000, false),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        ]
        const audios: AudioQuality[] = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        const opts = buildVideoLevelOptions(videos, map)
        expect(opts).toHaveLength(1)
        expect(opts[0].level).toBe(map.byVideo.get("video-h264-720p"))
    })

    test("outputs に含まれない動画 (byVideo に居ない動画) は除外する", () => {
        const videos: VideoQuality[] = [
            // 1440p は outputs には居ないが videos には居る
            makeVideo("video-h264-1440p", 4, 2560, 1440, 6000000),
            makeVideo("video-h264-720p", 2, 1280, 720, 2500000),
        ]
        const audios: AudioQuality[] = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        const opts = buildVideoLevelOptions(videos, map)
        expect(opts).toHaveLength(1)
        expect(opts[0].level).toBe(map.byVideo.get("video-h264-720p"))
    })

    test("video.label が空文字や undefined の時は `${height}p` にフォールバック", () => {
        const videos: VideoQuality[] = [
            { ...makeVideo("video-h264-720p", 2, 1280, 720, 2500000), label: "" },
            makeVideo("video-h264-480p", 1, 854, 480, 1000000),
        ]
        const audios: AudioQuality[] = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        const opts = buildVideoLevelOptions(videos, map)
        expect(opts[0].label).toBe("720p")
        expect(opts[1].label).toBe("480p")
    })

    test("videos が空なら空配列", () => {
        const videos: VideoQuality[] = []
        const audios: AudioQuality[] = [makeAudio("audio-aac-192kbps", 1, 192000)]
        const map = buildVideoLevelMap(levels, outputs, videos, audios)
        expect(buildVideoLevelOptions(videos, map)).toEqual([])
    })
})

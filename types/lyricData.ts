export interface LyricDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    videoId: string
    lyrics: Lyric[]
    hasTimeInformation: boolean
}

interface Lyric {
    lines: string[]
    startMs: null | number
    endMs: null | number
}

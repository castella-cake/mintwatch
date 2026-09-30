export interface VideoDataHeartBeatRootObject extends baseResponse {
    data: Data
}

interface Data {
    responseType: string
    media: Media
}

interface Media {
    hls: Hls
}

interface Hls {
    url: string
    outputs: any[]
    createdAt: string
    expiredAt: string
}

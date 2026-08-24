export interface VideosDataRootObject extends baseResponse {
    data: {
        items: {
            watchId: string
            video: VideoItem
        }[]
    }
}

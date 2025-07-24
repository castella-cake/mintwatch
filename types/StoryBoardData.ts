export interface StoryBoardImageRootObject {
    version: string
    thumbnailWidth: number
    thumbnailHeight: number
    columns: number
    rows: number
    interval: number
    images: Image[]
}

interface Image {
    timestamp: number
    url: string
}

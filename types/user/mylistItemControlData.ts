export interface MylistItemControlDataRootObject extends baseResponse {
    data: Data
}

interface Data {
    duplicatedIds: string[]
    processedIds: string[]
}

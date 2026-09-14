export interface RecommendationsDataRootObject extends baseResponse {
    data: Data
}

interface Data extends jsonResponseData {
    response: Response
}

interface Response {
    $getRecommend: Omit<RecommendDataRootObject, "meta">
    page: Page
}

interface Page {
    playlist: string
}

export interface SearchDataRootObject extends baseResponse {
    data: Data2
}

interface Data2 extends jsonResponseData {
    response: Response
}

interface Response {
    $getSearchVideoV2: GetSearchVideoV2
    page: Page
}

interface Page {
    common: SearchPageCommon
    playlist: string
}

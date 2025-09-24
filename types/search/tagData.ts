export interface SearchTagDataRootObject extends baseResponse {
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
    nicodic: SearchNicodic
    nicoadGroupsRequestIdMap: NicoadGroupsRequestIdMap
    playlist: string
}

interface NicoadGroupsRequestIdMap {
    nicodic: number
}

export interface SearchNicodic {
    url: string
    title: string
    summary: string
    advertisable: boolean
}

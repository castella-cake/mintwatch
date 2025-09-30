import { SearchExpandRootObject } from "@/types/search/expand"
import APIError from "@/utils/classes/APIError"

export async function searchExpand(query: string) {
    const url = new URL(`https://sug.search.nicovideo.jp/suggestion/expand/${encodeURIComponent(query)}`)
    const response = await fetch(url.toString(), {
        method: "GET",
    })
    const responseJson = await response.json() as SearchExpandRootObject
    if (!response.ok) {
        throw new APIError("searchExpand failed.", responseJson)
    }
    return responseJson
}

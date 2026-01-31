import { NicoDicArticlesApiDataRootObject } from "@/types/dictionaly/articlesApiData"
import APIError from "@/utils/classes/APIError"

export async function getArticle(type: "article" | "video", query: string) {
    if (type !== "article" && type !== "video") {
        throw new Error("getArticle failed: Invalid article type")
    }
    const response = await fetch(`https://api.dic.nicovideo.jp/v1/articles/${encodeURIComponent(type)}/${encodeURIComponent(query)}`)
    const responseJson = await response.json()
    if (!response.ok) {
        throw new APIError(`getArticle failed: HTTP status ${response.status}`, responseJson)
    }
    return responseJson as NicoDicArticlesApiDataRootObject
}

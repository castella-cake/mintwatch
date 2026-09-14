import APIError from "../classes/APIError"
import { PlaylistRecipeIdDataRootObject } from "@/types/PlaylistRecipeIdData"

export type RecipePlaylistOptions = {
    recipeId?: string
    recipeVersion?: number
    limit?: number
}

export async function getRecipePlaylist(videoId: string, options: RecipePlaylistOptions = {}) {
    const params = new URLSearchParams({
        recipeId: options.recipeId ?? "video_short_watch_recommendation",
        recipeVersion: String(options.recipeVersion ?? 1),
        site: "nicovideo",
        videoId,
        currentVideoId: videoId,
        limit: String(options.limit ?? 25),
    })
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/playlist/recipe-id?${params.toString()}`, {
        credentials: "include",
        method: "GET",
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
        },
    })
    const responseJson: PlaylistRecipeIdDataRootObject = await response.json()
    if (!validateBaseResponse(responseJson)) throw new APIError("Shorts recommend API failed.", responseJson)
    return responseJson
}

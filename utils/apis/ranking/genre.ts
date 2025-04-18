import { GenreRankingDataRootObject } from "@/types/ranking/genreData";


export async function getGenreRanking(page = "1", featuredKey?: string, tag?: string) {
    const baseUrl = new URL(`https://www.nicovideo.jp/ranking/genre${featuredKey ? "/" + encodeURIComponent(featuredKey) : ""}?responseType=json&page=${encodeURIComponent(page)}`)
    if (featuredKey && tag) baseUrl.searchParams.set("tag", tag)
    const response = await fetch(baseUrl, {
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as GenreRankingDataRootObject
}

import { GenreRankingDataRootObject } from "@/types/ranking/genreData";


export async function getGenreRanking() {
    const response = await fetch("https://www.nicovideo.jp/ranking/genre?responseType=json", {
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as GenreRankingDataRootObject
}

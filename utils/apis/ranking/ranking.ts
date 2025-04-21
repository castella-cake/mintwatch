import { ForYouRankingDataRootObject } from "@/types/ranking/forYouData";

/**
 * For you ランキングを取得するAPI
 */
export async function getForYouRanking() {
    const response = await fetch("https://www.nicovideo.jp/ranking?responseType=json", {
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as ForYouRankingDataRootObject
}

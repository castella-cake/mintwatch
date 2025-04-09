import { CustomRankingDataRootObject } from "@/types/ranking/customData";

export async function getCustomRanking() {
    const response = await fetch("https://www.nicovideo.jp/ranking/custom?responseType=json", {
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as CustomRankingDataRootObject
}

import { CustomRankingDataRootObject } from "@/types/ranking/customData";
import APIError from "@/utils/classes/APIError";
import { validateBaseResponse } from "@/utils/validateResponse";

/**
 * 将棋盤を取得するAPI
 */
export async function getCustomRanking() {
    const response = await fetch("https://www.nicovideo.jp/ranking/custom?responseType=json", {
        "method": "GET",
        "credentials": "include"
    });
    const responseJson = await response.json() as CustomRankingDataRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("getCustomRanking failed.", responseJson)
    return responseJson
}

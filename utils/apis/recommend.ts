import { RecommendDataRootObject } from "@/types/RecommendData";

export async function getRecommend(smId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/recommend?recipeId=video_watch_recommendation&videoId=${encodeURIComponent(smId)}&limit=25&site=nicovideo&_frontendId=6&_frontendVersion=0`, {
        "credentials": "include",
        "method": "GET"
    });
    const json: RecommendDataRootObject = await response.json()
    return json
}
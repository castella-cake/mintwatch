import { DAnimeLinksDataRootObject } from "@/types/DAnimeLinksData";

export async function channelVideoDAnimeLinks(videoId: string) {
    const response = await fetch(`https://public-api.ch.nicovideo.jp/v1/user/channelVideoDAnimeLinks?videoId=${encodeURIComponent(videoId)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0"
        },
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as DAnimeLinksDataRootObject
}

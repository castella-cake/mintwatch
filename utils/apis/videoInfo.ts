import { VideoDataRootObject } from "@/types/VideoData"
import APIError from "../classes/APIError";

const manifestData = browser.runtime.getManifest();

/**
 * 動画情報を取得する(正確には視聴ページ情報を取得する)API
 * @param smId 動画ID
 */
export async function getVideoInfo(smId: string) {
    // responseType=jsonで取得。
    const response = await fetch(`https://www.nicovideo.jp/watch/${encodeURIComponent(smId)}?responseType=json`, {
        "credentials": "include",
        "headers": {
            "User-Agent": `PepperMintPlus-Watch/${manifestData.version}`,
        },
        "method": "GET"
    })
    const responseJson: VideoDataRootObject = await response.json()
    if (responseJson.meta.status !== 200) throw new APIError("VideoData fetch failed.", responseJson)
    return responseJson
}
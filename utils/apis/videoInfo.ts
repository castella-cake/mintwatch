import { VideoDataRootObject } from "@/types/VideoData"

const manifestData = browser.runtime.getManifest();
export function getVideoInfo(smId: string): Promise<VideoDataRootObject> {
    return new Promise(async (resolve, reject) => {
        try {
            // responseType=jsonで取得。
            const response = await fetch(`https://www.nicovideo.jp/watch/${encodeURIComponent(smId)}?responseType=json`, {
                "credentials": "include",
                "headers": {
                    "User-Agent": `PepperMintPlus-Watch/${manifestData.version}`,
                },
                "method": "GET"
            })
            const responseJson: VideoDataRootObject = await response.json()
            if (responseJson.meta.status !== 200) reject(responseJson)
            resolve(responseJson)
        } catch (err) {
            reject(err)
        }
    })
}
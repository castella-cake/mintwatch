import { OshiraseBellDataRootObject } from "@/types/OshiraseBellData"
import { OshiraseBoxRootObject } from "@/types/OshiraseBoxData"
import APIError from "../classes/APIError"

/**
 * お知らせボックスから通知を取得するAPI
 * @param offset どれだけ後ろの通知を取得するか。基本は0で良い
 * @param importantOnly 重要な通知のみを取得するかどうか。
 */
export async function getOshiraseBox(offset = 0, importantOnly = false) {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/box?offset=${encodeURIComponent(offset)}&importantOnly=${encodeURIComponent(importantOnly.toString())}`, {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
        },
        method: "GET",
    })
    const responseJson = await response.json() as OshiraseBoxRootObject
    if (!validateBaseResponse(responseJson)) {
        throw new APIError("getOshiraseBox failed.", responseJson)
    }
    return responseJson
}

/**
 * 最後にお知らせボックスを開いてからの新着通知があるかどうかを返すAPI
 */
export async function getOshiraseBell() {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/bell`, {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
        },
        method: "GET",
    })
    const responseJson = await response.json() as OshiraseBellDataRootObject
    if (!validateBaseResponse(responseJson)) {
        throw new APIError("getOshiraseBell failed.", responseJson)
    }
    return responseJson
}

/**
 * 指定した通知を既読にするAPI
 * @param id 通知ID
 * @param requestWith これを行ったページのURL
 */
export async function sendOshiraseBoxRead(id: string, requestWith: string) {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/notifications/${encodeURIComponent(id)}/read?header=pc`, {
        headers: {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": requestWith,
        },
        method: "PUT",
        credentials: "include",
    })
    const responseJson = await response.json() as baseResponse
    if (!validateBaseResponse(responseJson)) {
        throw new APIError("sendOshiraseBoxRead failed.", responseJson)
    }
    return responseJson
}

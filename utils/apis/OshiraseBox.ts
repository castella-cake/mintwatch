import { OshiraseBellDataRootObject } from "@/types/OshiraseBellData";
import { OshiraseBoxRootObject } from "@/types/OshiraseBoxData";

export async function getOshiraseBox(offset = 0, importantOnly = false) {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/box?offset=${encodeURIComponent(offset)}&importantOnly=${encodeURIComponent(importantOnly.toString())}`, {
        "credentials": "include",
        "headers": {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0"
        },
        "method": "GET",
    });
    return await response.json() as OshiraseBoxRootObject
}

export async function getOshiraseBell() {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/bell`, {
        "credentials": "include",
        "headers": {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0"
        },
        "method": "GET",
    });
    return await response.json() as OshiraseBellDataRootObject
}

export async function sendOshiraseBoxRead(id: string, requestWith: string) {
    const response = await fetch(`https://api.oshirasebox.nicovideo.jp/v1/notifications/${encodeURIComponent(id)}/read?header=pc`, {
        "headers": {
            "content-type": "application/json",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": requestWith,
        },
        "method": "PUT",
        "credentials": "include"
    });
    return await response.json() as baseResponse
}
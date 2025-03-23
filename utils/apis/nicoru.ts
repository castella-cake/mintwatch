import { NicoruKeyResponseRootObject, NicoruPostBodyRootObject, NicoruPostResponseRootObject, NicoruRemoveRootObject } from "@/types/NicoruPostData";

export async function getNicoruKey(threadId: string | number, fork: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/comment/keys/nicoru?threadId=${encodeURIComponent(threadId)}&fork=${encodeURIComponent(fork)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp"
        },
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as NicoruKeyResponseRootObject
}

export async function postNicoru(threadId: string | number, body: NicoruPostBodyRootObject) {
    const response = await fetch(`https://public.nvcomment.nicovideo.jp/v1/threads/${encodeURIComponent(threadId)}/nicorus`, {
        "headers": {
            "x-client-os-type": "others",
            "x-frontend-id": "6",
            "x-frontend-version": "0"
        },
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit",
        "cache": "no-store"
    });
    return await response.json() as NicoruPostResponseRootObject
}

export async function removeNicoru(nicoruId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/users/me/nicoru/send/${encodeURIComponent(nicoruId)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "nicovideo"
        },
        "method": "DELETE",
        "mode": "cors",
        "credentials": "include"
    });
    return await response.json() as NicoruRemoveRootObject
}
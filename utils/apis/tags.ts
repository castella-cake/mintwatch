export async function getTagsApi(smId: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/videos/${encodeURIComponent(smId)}/tags`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp"
        },
        "method": "GET",
        "credentials": "include"
    });
    return await response.json() as TagsApiRootObject
}

// POST / DELETE
export async function tagsEditApi(smId: string, tag: string, method: "POST" | "DELETE" = "POST") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/videos/${encodeURIComponent(smId)}/tags?tag=${encodeURIComponent(tag)}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp"
        },
        "body": null,
        "credentials": "include",
        "method": method,
    });
    return await response.json() as TagsApiRootObject
}

export async function tagsLockApi(smId: string, tag: string, isLocked: boolean) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v1/videos/${encodeURIComponent(smId)}/tags/lock?tag=${encodeURIComponent(tag)}&isLocked=${encodeURIComponent(isLocked.toString())}`, {
        "headers": {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp"
        },
        "method": "PUT",
        "credentials": "include"
    });
    return await response.json() as TagsApiRootObject
}
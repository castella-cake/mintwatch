/**
 * 指定した動画のタグを取得するAPI
 * @param smId タグを取得する動画のID
 */
export async function getTagsApi(smId: string, editKey: string) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v2/videos/${encodeURIComponent(smId)}/tags`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-tag-edit-key": editKey,
        },
        method: "GET",
        credentials: "include",
    })
    return await response.json() as TagsApiRootObject
}

/**
 * 指定した動画のタグを編集するAPI
 * @param smId タグを編集する動画のID
 * @param tag 追加/削除するタグ名
 * @param method POSTで追加/DELETEで削除
 */
export async function tagsEditApi(smId: string, editKey: string, tag: string, method: "POST" | "DELETE" = "POST") {
    const response = await fetch(`https://nvapi.nicovideo.jp/v2/videos/${encodeURIComponent(smId)}/tags?tag=${encodeURIComponent(tag)}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
            "x-tag-edit-key": editKey,
        },
        body: null,
        credentials: "include",
        method: method,
    })
    return await response.json() as TagsApiRootObject
}

/**
 * 指定したタグのロック状態を編集するAPI isLockableなどで確認しておくこと
 * @param smId タグロックを編集する動画のID
 * @param tag タグロックを編集するタグ名
 * @param isLocked 変更先のロック状態
 */
export async function tagsLockApi(smId: string, editKey: string, tag: string, isLocked: boolean) {
    const response = await fetch(`https://nvapi.nicovideo.jp/v2/videos/${encodeURIComponent(smId)}/tags/lock?tag=${encodeURIComponent(tag)}&isLocked=${encodeURIComponent(isLocked.toString())}`, {
        headers: {
            "x-frontend-id": "6",
            "x-frontend-version": "0",
            "x-niconico-language": "ja-jp",
            "x-request-with": "https://www.nicovideo.jp",
            "x-tag-edit-key": editKey,
        },
        method: "PUT",
        credentials: "include",
    })
    return await response.json() as TagsApiRootObject
}

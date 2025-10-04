import APIError from "../classes/APIError"

/**
 * NGワードを追加するAPI
 * @param type "word": コメント / "id": ユーザーID / "command": コマンド
 * @param source wordの場合はNGワード / idの場合はユーザーID / commandの場合は+で区切ったコマンド
 * @param languageId ターゲットにする言語別コメント?
 * @returns 変更を反映した後のNGコメント
 */
export async function addNgComment(type: "word" | "id" | "command", source: string, languageId = "0") {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/ng-comments/client", {
        credentials: "include",
        headers: {
            "accept": "application/json;charset=utf-8",
            "content-type": "application/x-www-form-urlencoded",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
            "X-Request-With": "nicovideo",
        },
        body: `type=${encodeURIComponent(type)}&source=${encodeURIComponent(source)}&languageId=${encodeURIComponent(languageId)}`,
        method: "POST",
    })
    const responseJson = await response.json() as NgCommentsRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("NG comment add failed.", responseJson)
    return responseJson
}

/**
 * NGワードを削除する
 * @param body targetsにNGワードのtypeとsourceを指定してJSONで渡す
 * @returns 変更を反映した後のNGコメント
 */
export async function deleteNgComments(body: { targets: { type: "word" | "id" | "command", source: string }[] }) {
    const response = await fetch("https://nvapi.nicovideo.jp/v1/users/me/ng-comments/client/items", {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "accept": "application/json;charset=utf-8",
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Niconico-Language": "ja-jp",
            "X-Request-With": "nicovideo",
        },
        body: JSON.stringify(body),
        method: "DELETE",
    })
    const responseJson = await response.json() as NgCommentsRootObject
    if (!validateBaseResponse(responseJson)) throw new APIError("NG comment delete failed.", responseJson)
    return responseJson
}

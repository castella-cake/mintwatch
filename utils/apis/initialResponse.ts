/**
 * server-response-mw から初期レスポンスを取得し、targetResponsePathnameとoptionsが同じ場合はそれを返す関数
 * @param targetResponsePathname 条件とするpathname
 * @param fallbackCallback 使用できなかった場合に呼び出すコールバック(API呼び出しなど, Promise)
 * @param keyword キーワード
 * @param options オプション
 */

export async function initialResponse<T extends baseResponse>(
    targetResponsePathname: string,
    fallbackCallback: (
        keyword: string,
        options: VideoSearchQuery
    ) => Promise<T>,
    keyword: string,
    options: VideoSearchQuery = {},
) {
    const dataResponseElements = document.getElementsByName("server-response-mw")
    let initialResponse: T | null = null

    if (dataResponseElements.length > 0) {
        const dataResponseElement = dataResponseElements[0]

        if (dataResponseElement.getAttribute("data-pathname")) {
            const responsePathname = dataResponseElement.getAttribute("data-pathname")
            const responseSearchParams = new URLSearchParams(dataResponseElement.getAttribute("data-search")!)
            // 要求中のoptionsと同じかどうかを確認
            const isSameAsOptions = Object.keys(options).every((optionKey) => {
                const option = options[optionKey as keyof typeof options]
                return responseSearchParams.get(optionKey)?.toString() === option?.toString()
            })

            // pathnameも含めて同じならこっちを使って高速化する
            if (responsePathname === targetResponsePathname && isSameAsOptions) {
                const responseJson = JSON.parse(dataResponseElement.getAttribute("content")!) as T
                if (validateBaseResponse(responseJson)) {
                    dataResponseElement.remove() // 使いまわすべきではないので削除。Reactの思想(一貫性)に反するがこうするしかない。
                    initialResponse = responseJson
                    console.log("using initialResponse", initialResponse)
                }
            }
        }
    }

    return initialResponse ?? await fallbackCallback(keyword, options)
}

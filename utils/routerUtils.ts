/**
 * このアンカー要素がルーター外に遷移するリンクかどうかを返す
 * @param element アンカー要素
 * @returns ルーター外に遷移するリンクであればtrue、それ以外はfalse
 */
export function isOutOfBoundsLinkAnchor(element: HTMLAnchorElement) {
    if (element.target == "_blank") return true
    return false
}

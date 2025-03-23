export async function getCommonsRelatives(videoId: string, limit = 15) {
    const response = await fetch(`https://public-api.commons.nicovideo.jp/v1/tree/${encodeURIComponent(videoId)}/relatives?_limit=${encodeURIComponent(limit)}&with_meta=1&_sort=-id`, {
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    if (!response.ok) return null;
    return await response.json() as CommonsRelativeRootObject
}
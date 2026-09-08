export function VideoItemToShareBody(video: VideoItem) {
    const shareURL = `https://www.nicovideo.jp/watch/${video.id}`
    const hashtags = [video.id, "ニコニコ動画", "PepperMintShare"]
    const ownerName = video.owner ? video.owner.name : "非公開または退会済みユーザー"

    return `${video.title} - by ${ownerName}\n${shareURL}\n#${hashtags.join(" #")}`
}

export function VideoDataToShareBody(videoInfoResponse: VideoDataRootObject["data"]["response"], pastLogWhen?: number) {
    const baseURL = `https://www.nicovideo.jp/watch/${videoInfoResponse.video.id}`
    const shareURL = pastLogWhen ? `${baseURL}?past_log=${pastLogWhen}` : baseURL
    const hashtags = [videoInfoResponse.video.id, "ニコニコ動画", "PepperMintShare"]
    const ownerName = videoInfoResponse.owner ? videoInfoResponse.owner.nickname : (videoInfoResponse.channel ? videoInfoResponse.channel.name : "非公開または退会済みユーザー")

    const lines = [
        `${videoInfoResponse.video.title} - by ${ownerName}`,
        shareURL,
    ]
    if (pastLogWhen) {
        lines.push(`(${new Date(pastLogWhen * 1000).toLocaleString("ja-JP")} 時点の過去ログ)`)
    }
    lines.push(`#${hashtags.join(" #")}`)

    return lines.join("\n")
}

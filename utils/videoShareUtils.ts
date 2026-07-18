export function VideoItemToShareBody(video: VideoItem) {
    const shareURL = `https://www.nicovideo.jp/watch/${video.id}`
    const hashtags = [video.id, "ニコニコ動画", "PepperMintShare"]
    const ownerName = video.owner ? video.owner.name : "非公開または退会済みユーザー"

    return `${video.title} - by ${ownerName}\n${shareURL}\n#${hashtags.join(" #")}`
}

export function VideoDataToShareBody(videoInfoResponse: VideoDataRootObject["data"]["response"]) {
    const shareURL = `https://www.nicovideo.jp/watch/${videoInfoResponse.video.id}`
    const hashtags = [videoInfoResponse.video.id, "ニコニコ動画", "PepperMintShare"]
    const ownerName = videoInfoResponse.owner ? videoInfoResponse.owner.nickname : (videoInfoResponse.channel ? videoInfoResponse.channel.name : "非公開または退会済みユーザー")

    return `${videoInfoResponse.video.title} - by ${ownerName}\n${shareURL}\n#${hashtags.join(" #")}`
}

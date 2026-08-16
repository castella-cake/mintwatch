import type { PlaylistResponseRootObject } from "../../types/playlistData"
import type { VideoItem } from "../../types/generic/VideoItemData"

function makeVideo(id: string, title: string): VideoItem {
    return {
        type: "essential",
        contentType: "long",
        id,
        title,
        registeredAt: "1970-01-01T00:00:00.000Z",
        count: {
            view: 0,
            comment: 0,
            mylist: 0,
            like: 0,
        },
        thumbnail: {
            url: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
            middleUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
            largeUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
            listingUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
            nHdUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
            shortUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
        },
        duration: 186,
        shortDescription: "TestDescriptionThatJustForTesting",
        latestCommentSummary: "",
        isChannelVideo: false,
        isPaymentRequired: false,
        playbackPosition: null,
        owner: {
            ownerType: "user",
            type: "user",
            visibility: "visible",
            id: "92343354",
            name: "CYakigasi",
            iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148",
        },
        requireSensitiveMasking: false,
        videoLive: null,
        isMuted: false,
    }
}

export const searchPlaylistTestData: PlaylistResponseRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        id: {
            type: "search_video",
            value: "{\"keyword\":\"TEST\",\"tag\":\"\",\"sort\":\"\",\"limit\":32,\"offset\":0}",
        },
        meta: {
            title: "TEST",
            ownerName: "キーワード検索",
        },
        totalCount: 3,
        items: [
            {
                watchId: "sm46661211",
                content: makeVideo("sm46661211", "検索結果の1番目"),
            },
            {
                watchId: "sm15751190",
                content: makeVideo("sm15751190", "検索結果の2番目"),
            },
            {
                watchId: "sm0",
                content: makeVideo("sm0", "For testing purposes only"),
            },
        ],
    },
}

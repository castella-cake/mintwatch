import { VideoDataLazyRootObject } from "@/types/watch/Lazy"

export const watchLazyTestData: VideoDataLazyRootObject = {
    meta: {
        status: 200,
    },
    data: {
        owner: {
            type: "user",
            visibility: "visible",
            id: 92343354,
            nickname: "CYakigasi",
            icon: {
                url: "https://example.com/e2e-icon.jpg",
            },
            follow: null,
            ownedChannel: null,
            currentLive: null,
            upcomingVideoLive: null,
        },
        ranking: {
            teiban: null,
        },
        series: null,
        waku: {
            information: null,
            bgImages: [
            ],
            addContents: null,
            addVideo: null,
            tagRelatedBanner: {
                title: "SomeTagEventTitle",
                imageUrl: "",
                description: "SomeTagEventDescription",
                isEvent: false,
                linkUrl: "https://www.nicovideo.jp/",
                linkType: "link",
                linkOrigin: "https://www.nicovideo.jp/",
                isNewWindow: false,
            },
            tagRelatedMarquee: null,
            pcHeaderCustomBanner: null,
        },
    },
}

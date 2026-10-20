import { VideoDataRootObject } from "@/types/watch/Base"

export const watchTestData: VideoDataRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        metadata: {
            title: "For testing purposes only - Testing動画",
            linkTags: [
            ],
            metaTags: [
            ],
            jsonLds: [
            ],
        },
        googleTagManager: {
            user: {
                login_status: "not_login",
            },
            content: {
                player_type: "er",
                genre: "未設定",
                content_type: "user",
            },
        },
        response: {
            $watchV4: {
                data: {
                    responseType: "normal",
                    client: {
                        nicosid: "",
                        watchId: "sm9",
                        watchTrackId: "aaaaaaaaaa_0000000000000",
                    },
                    comment: {
                        threads: [
                            {
                                id: 1173108780,
                                fork: 1,
                                forkLabel: "owner",
                                videoId: "sm9",
                                isPostTarget: false,
                                isOwnerThread: true,
                                is184Forced: false,
                                label: "owner",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1173108780,
                                fork: 0,
                                forkLabel: "main",
                                videoId: "sm9",
                                isPostTarget: true,
                                isOwnerThread: false,
                                is184Forced: false,
                                label: "default",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1173108780,
                                fork: 2,
                                forkLabel: "easy",
                                videoId: "sm9",
                                isPostTarget: false,
                                isOwnerThread: false,
                                is184Forced: false,
                                label: "easy",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                        ],
                        layers: [
                            {
                                index: 0,
                                isTranslucent: false,
                                components: [
                                    {
                                        threadId: 1173108780,
                                        fork: 1,
                                        forkLabel: "owner",
                                    },
                                ],
                            },
                            {
                                index: 1,
                                isTranslucent: false,
                                components: [
                                    {
                                        threadId: 1173108780,
                                        fork: 0,
                                        forkLabel: "main",
                                    },
                                    {
                                        threadId: 1173108780,
                                        fork: 2,
                                        forkLabel: "easy",
                                    },
                                ],
                            },
                        ],
                        ng: {
                            ngScore: {
                                isDisabled: false,
                            },
                            owner: [
                            ],
                            viewer: null,
                        },
                        isAttentionRequired: false,
                        nvComment: {
                            threadKey: "noThreadKey4U",
                            server: "https://public.nvcomment.nicovideo.jp",
                            params: {
                                targets: [
                                    {
                                        id: "1173108780",
                                        fork: "owner",
                                    },
                                    {
                                        id: "1173108780",
                                        fork: "main",
                                    },
                                    {
                                        id: "1173108780",
                                        fork: "easy",
                                    },
                                ],
                                language: "ja-jp",
                            },
                        },
                        assist: {
                            sectionDurationSec: 6,
                            minMatchCharacters: 15,
                            ignorePostElapsedTimeSec: 0,
                            ignoreCommentNgScoreThreshold: -1000,
                            commentCountThresholdList: [
                                [
                                    4,
                                    6,
                                ],
                                [
                                    14,
                                    18,
                                ],
                                [
                                    26,
                                    1500,
                                ],
                            ],
                            buttonDisplayDurationSec: 6,
                            buttonDisplayOffsetSec: 2,
                        },
                    },
                    media: {
                        contents: {
                            videos: [
                                {
                                    id: "video-h264-360p",
                                    isAvailable: true,
                                    qualityLevel: 1,
                                    label: "360p",
                                    bitRate: 602592,
                                    width: 320,
                                    height: 240,
                                },
                                {
                                    id: "video-h264-360p-lowest",
                                    isAvailable: true,
                                    qualityLevel: 0,
                                    label: "低画質",
                                    bitRate: 302594,
                                    width: 480,
                                    height: 360,
                                },
                            ],
                            audios: [
                                {
                                    id: "audio-aac-128kbps",
                                    isAvailable: true,
                                    qualityLevel: 1,
                                    bitRate: 104747,
                                    samplingRate: 44100,
                                    integratedLoudness: -6.5,
                                    truePeak: 0.8,
                                    loudnessCollection: [
                                        {
                                            type: "video",
                                            value: 0.3758374042884442,
                                        },
                                        {
                                            type: "pureAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "pureAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "pureAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "nicoadVideoIntroduce",
                                            value: 0.8912509381337456,
                                        },
                                        {
                                            type: "nicoadBillboard",
                                            value: 1,
                                        },
                                        {
                                            type: "marquee",
                                            value: 1,
                                        },
                                    ],
                                    label: {
                                        quality: "標準音質",
                                        bitrate: "128kbps",
                                    },
                                },
                                {
                                    id: "audio-aac-64kbps",
                                    isAvailable: true,
                                    qualityLevel: 0,
                                    bitRate: 78056,
                                    samplingRate: 44100,
                                    integratedLoudness: -6.5,
                                    truePeak: 0.8,
                                    loudnessCollection: [
                                        {
                                            type: "video",
                                            value: 0.3758374042884442,
                                        },
                                        {
                                            type: "pureAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdPreroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "pureAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdMidroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "pureAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "houseAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "networkAdPostroll",
                                            value: 0.7079457843841379,
                                        },
                                        {
                                            type: "nicoadVideoIntroduce",
                                            value: 0.8912509381337456,
                                        },
                                        {
                                            type: "nicoadBillboard",
                                            value: 1,
                                        },
                                        {
                                            type: "marquee",
                                            value: 1,
                                        },
                                    ],
                                    label: {
                                        quality: "低音質",
                                        bitrate: "64kbps",
                                    },
                                },
                            ],
                        },
                        isStoryboardAvailable: false,
                        accessRightKey: "e2e-access-right-key",
                        hls: {
                            url: "https://delivery.example.com/hls/e2e/master.m3u8",
                            outputs: [
                                {
                                    assetUnitNames: [
                                        "video-h264-360p",
                                        "audio-aac-128kbps",
                                    ],
                                },
                                {
                                    assetUnitNames: [
                                        "video-h264-360p",
                                        "audio-aac-64kbps",
                                    ],
                                },
                                {
                                    assetUnitNames: [
                                        "video-h264-360p-lowest",
                                        "audio-aac-128kbps",
                                    ],
                                },
                                {
                                    assetUnitNames: [
                                        "video-h264-360p-lowest",
                                        "audio-aac-64kbps",
                                    ],
                                },
                            ],
                            createdAt: "2026-10-20T13:40:44+00:00",
                            expiredAt: "2026-10-21T13:40:44+00:00",
                        },
                        lowDataMode: {
                            videoUpperLimit: 1,
                            audioUpperLimit: 1,
                        },
                    },
                    player: {
                        comment: {
                            isDefaultInvisible: false,
                        },
                        initialPlayback: null,
                        layerMode: 0,
                    },
                    video: {
                        id: "sm9",
                        contentType: "long",
                        title: "For testing purpose only",
                        description: "For testing purpose only",
                        supplements: [
                        ],
                        count: {
                            view: 0,
                            comment: 0,
                            mylist: 0,
                            like: 0,
                        },
                        duration: 320,
                        thumbnail: {
                            normal: "https://nicovideo.cdn.nimg.jp/thumbnails/e2e/e2e",
                            middle: null,
                            large: null,
                            player: "https://nicovideo.cdn.nimg.jp/thumbnails/e2e/e2e",
                            ogp: "https://nicovideo.cdn.nimg.jp/thumbnails/e2e/e2e",
                            short: null,
                        },
                        registeredAt: "1970-01-01T00:00:00.000Z",
                        permission: {
                            isPrivate: false,
                            isDeleted: false,
                            isAuthenticationRequired: false,
                            isEmbedPlayerAllowed: true,
                            isGiftAllowed: true,
                            isNgForVocacolleApp: false,
                            rating: {
                                isAdult: false,
                            },
                        },
                        hasLyrics: false,
                        isHighRiskVideo: false,
                        isChannelVideo: false,
                        isOwnedByViewer: false,
                        showOwnerMenu: false,
                        isLikedByViewer: false,
                    },
                    genre: {
                        key: "none",
                        label: "未設定",
                        isImmoral: false,
                        isDisabled: false,
                        isNotSet: true,
                    },
                    tags: {
                        items: [
                            {
                                name: "陰陽師",
                                isLocked: true,
                            },
                        ],
                        hasR18Tag: false,
                        isPublishedNicoscript: false,
                        edit: {
                            isEditable: false,
                            uneditableReason: "NEED_LOGIN",
                            editKey: null,
                        },
                    },
                    lazy: {
                        authKey: "e2e-lazy-auth-key",
                    },
                    system: {
                        serverTime: "2026-01-01T00:00:00+09:00",
                        isStellaAlive: true,
                        channelGtmContainerId: "GTM-K8M6VGZ",
                    },
                    viewer: null,
                    videoAds: {
                        additionalParams: {
                            videoId: "sm9",
                            videoDuration: 320,
                            isAdultRatingNG: false,
                            isAuthenticationRequired: false,
                            isR18: false,
                            nicosid: "",
                            lang: "ja-jp",
                            watchTrackId: "aaaaaaaaaa_0000000000000",
                        },
                        items: [
                        ],
                        reason: "non_premium_user_ads",
                    },
                    videoLive: null,
                    payment: {
                        ppv: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        admission: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        continuationBenefit: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        premium: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        watchableUserType: "all",
                        commentableUserType: "all",
                        billingType: "free",
                    },
                    baseVideo: {
                        baseVideoId: null,
                        contentType: null,
                        title: null,
                        thumbnail: null,
                    },
                    metadata: {
                        jsonLd: {
                            owner: {
                                id: "92343354",
                                type: "user",
                                name: "CYakigasi",
                                description: "For testing purpose only",
                                iconUrl: "https://example.com/e2e-icon.jpg",
                            },
                            videoObject: {
                                regionsAllowed: null,
                                expiresAt: null,
                            },
                        },
                        gtm: {
                            channel: null,
                        },
                    },
                    okReason: "PURELY",
                },
            },
            pcweb: {
                prebidAdSlotName: "",
            },
        },
    },
}

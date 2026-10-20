import { VideoDataRootObject } from "@/types/watch/Base"

export const ppvForbiddenWatchTestData: VideoDataRootObject = {
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
                genre: "アニメ",
                content_type: "channel",
                channel_id: "2581583",
                ch_register_status: "未入会",
                pay_status: "カスタム",
            },
        },
        response: {
            $watchV4: {
                data: {
                    responseType: "normal",
                    client: {
                        nicosid: "",
                        watchId: "so22102776",
                        watchTrackId: "a_1",
                    },
                    comment: {
                        threads: [
                            {
                                id: 1382511079,
                                fork: 1,
                                forkLabel: "owner",
                                videoId: "so22102776",
                                isPostTarget: false,
                                isOwnerThread: true,
                                is184Forced: false,
                                label: "owner",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1382511079,
                                fork: 0,
                                forkLabel: "main",
                                videoId: "so22102776",
                                isPostTarget: false,
                                isOwnerThread: false,
                                is184Forced: false,
                                label: "default",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1382511080,
                                fork: 0,
                                forkLabel: "main",
                                videoId: "so22102776",
                                isPostTarget: true,
                                isOwnerThread: false,
                                is184Forced: true,
                                label: "community",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1382511080,
                                fork: 2,
                                forkLabel: "easy",
                                videoId: "so22102776",
                                isPostTarget: false,
                                isOwnerThread: false,
                                is184Forced: true,
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
                                        threadId: 1382511079,
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
                                        threadId: 1382511080,
                                        fork: 0,
                                        forkLabel: "main",
                                    },
                                    {
                                        threadId: 1382511080,
                                        fork: 2,
                                        forkLabel: "easy",
                                    },
                                ],
                            },
                            {
                                index: 2,
                                isTranslucent: true,
                                components: [
                                    {
                                        threadId: 1382511079,
                                        fork: 0,
                                        forkLabel: "main",
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
                                        id: "1382511079",
                                        fork: "owner",
                                    },
                                    {
                                        id: "1382511079",
                                        fork: "main",
                                    },
                                    {
                                        id: "1382511080",
                                        fork: "main",
                                    },
                                    {
                                        id: "1382511080",
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
                    media: null,
                    player: {
                        comment: {
                            isDefaultInvisible: false,
                        },
                        initialPlayback: null,
                        layerMode: 0,
                    },
                    video: {
                        id: "so22102776",
                        contentType: "long",
                        title: "For PPV testing purpose only",
                        description: "For testing purpose only",
                        supplements: [
                        ],
                        count: {
                            view: 0,
                            comment: 0,
                            mylist: 0,
                            like: 0,
                        },
                        duration: 1442,
                        thumbnail: {
                            normal: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            middle: null,
                            large: null,
                            player: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            ogp: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            short: null,
                        },
                        registeredAt: "1970-01-01T00:00:00.000Z",
                        permission: {
                            isPrivate: false,
                            isDeleted: false,
                            isAuthenticationRequired: true,
                            isEmbedPlayerAllowed: true,
                            isGiftAllowed: false,
                            isNgForVocacolleApp: true,
                            rating: {
                                isAdult: false,
                            },
                        },
                        hasLyrics: false,
                        isHighRiskVideo: false,
                        isChannelVideo: true,
                        isOwnedByViewer: false,
                        showOwnerMenu: false,
                        isLikedByViewer: false,
                    },
                    genre: {
                        key: "anime",
                        label: "アニメ",
                        isImmoral: false,
                        isDisabled: false,
                        isNotSet: false,
                    },
                    tags: {
                        items: [
                            {
                                name: "アニメ",
                                isLocked: true,
                            },
                        ],
                        hasR18Tag: false,
                        isPublishedNicoscript: false,
                        edit: {
                            isEditable: false,
                            uneditableReason: "USER_FORBIDDEN",
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
                            videoId: "so22102776",
                            videoDuration: 1442,
                            isAdultRatingNG: false,
                            isAuthenticationRequired: true,
                            isR18: false,
                            nicosid: "",
                            lang: "ja-jp",
                            watchTrackId: "a_1",
                            channelId: "ch0",
                            genre: "anime",
                        },
                        items: [
                        ],
                        reason: null,
                    },
                    videoLive: null,
                    payment: {
                        ppv: {
                            isEnabled: true,
                            showPromotion: true,
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
                        watchableUserType: "purchaser",
                        commentableUserType: "purchaser",
                        billingType: "custom",
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
                                id: "ch0",
                                type: "channel",
                                name: "Test Channel",
                                description: "For testing purpose only",
                                iconUrl: "https://example.com/e2e-icon.jpg",
                            },
                            videoObject: {
                                regionsAllowed: "JP",
                                expiresAt: "2038-01-01T00:00:00+09:00",
                            },
                        },
                        gtm: {
                            channel: {
                                id: "ch0",
                                isMember: false,
                            },
                        },
                    },
                    okReason: "PAYMENT_PREVIEW_SUPPORTED",
                },
            },
            pcweb: {
                prebidAdSlotName: "/21687149840/niconico_video_pc_nw_forceskip",
            },
        },
    },
}

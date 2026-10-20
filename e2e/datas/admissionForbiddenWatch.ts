import { VideoDataRootObject } from "@/types/watch/Base"

export const admissionForbiddenWatchTestData: VideoDataRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        metadata: {
            title: "For Admission testing purposes only - Testing動画",
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
                channel_id: "2632720",
                ch_register_status: "未入会",
                pay_status: "無料（会員限定）",
            },
        },
        response: {
            $watchV4: {
                data: {
                    responseType: "normal",
                    client: {
                        nicosid: "",
                        watchId: "so31960146",
                        watchTrackId: "a_1",
                    },
                    comment: {
                        threads: [
                            {
                                id: 1505890119,
                                fork: 1,
                                forkLabel: "owner",
                                videoId: "so31960146",
                                isPostTarget: false,
                                isOwnerThread: true,
                                is184Forced: false,
                                label: "owner",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1505890119,
                                fork: 0,
                                forkLabel: "main",
                                videoId: "so31960146",
                                isPostTarget: false,
                                isOwnerThread: false,
                                is184Forced: false,
                                label: "default",
                                postNgReason: null,
                                syncBufferTime: 300,
                            },
                            {
                                id: 1505890120,
                                fork: 0,
                                forkLabel: "main",
                                videoId: "so31960146",
                                isPostTarget: true,
                                isOwnerThread: false,
                                is184Forced: true,
                                label: "community",
                                postNgReason: "channelRestriction",
                                syncBufferTime: 300,
                            },
                            {
                                id: 1505890120,
                                fork: 2,
                                forkLabel: "easy",
                                videoId: "so31960146",
                                isPostTarget: false,
                                isOwnerThread: false,
                                is184Forced: true,
                                label: "easy",
                                postNgReason: "channelRestriction",
                                syncBufferTime: 300,
                            },
                        ],
                        layers: [
                            {
                                index: 0,
                                isTranslucent: false,
                                components: [
                                    {
                                        threadId: 1505890119,
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
                                        threadId: 1505890120,
                                        fork: 0,
                                        forkLabel: "main",
                                    },
                                    {
                                        threadId: 1505890120,
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
                                        threadId: 1505890119,
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
                                        id: "1505890119",
                                        fork: "owner",
                                    },
                                    {
                                        id: "1505890119",
                                        fork: "main",
                                    },
                                    {
                                        id: "1505890120",
                                        fork: "main",
                                    },
                                    {
                                        id: "1505890120",
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
                        id: "so31960146",
                        contentType: "long",
                        title: "For Admission testing purpose only",
                        description: "For testing purpose only",
                        supplements: [
                        ],
                        count: {
                            view: 0,
                            comment: 0,
                            mylist: 0,
                            like: 0,
                        },
                        duration: 1435,
                        thumbnail: {
                            normal: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            middle: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            large: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            player: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            ogp: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                            short: null,
                        },
                        registeredAt: "1970-01-01T00:00:00.000Z",
                        permission: {
                            isPrivate: false,
                            isDeleted: false,
                            isAuthenticationRequired: true,
                            isEmbedPlayerAllowed: false,
                            isGiftAllowed: false,
                            isNgForVocacolleApp: true,
                            rating: {
                                isAdult: false,
                            },
                        },
                        hasLyrics: false,
                        isHighRiskVideo: true,
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
                            videoId: "so31960146",
                            videoDuration: 1435,
                            isAdultRatingNG: true,
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
                            isEnabled: false,
                            showPromotion: false,
                        },
                        admission: {
                            isEnabled: true,
                            showPromotion: true,
                        },
                        continuationBenefit: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        premium: {
                            isEnabled: false,
                            showPromotion: false,
                        },
                        watchableUserType: "member",
                        commentableUserType: "member",
                        billingType: "member_only",
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
                prebidAdSlotName: "",
            },
        },
    },
}

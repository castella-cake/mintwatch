import { VideoDataRootObject } from "@/types/VideoData"

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
                content_type: "user",
            },
        },
        response: {
            ads: null,
            category: null,
            channel: {
                id: "ch2",
                name: "Test Channel 2",
                isOfficialAnime: true,
                isDisplayAdBanner: true,
                thumbnail: {
                    url: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg",
                    smallUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg",
                },
                viewer: {
                    follow: {
                        isFollowed: false,
                        isBookmarked: false,
                        token: "",
                        tokenTimestamp: 0,
                    },
                },
            },
            client: {
                nicosid: "",
                watchId: "so2",
                watchTrackId: "a_1",
            },
            comment: {
                server: {
                    url: "",
                },
                keys: {
                    userKey: "",
                },
                layers: [],
                threads: [],
                ng: {
                    ngScore: {
                        isDisabled: false,
                    },
                    channel: [],
                    owner: [],
                    viewer: null,
                },
                isAttentionRequired: false,
                nvComment: {
                    threadKey: "",
                    server: "https://public.nvcomment.nicovideo.jp",
                    params: {
                        targets: [
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
                    ],
                    buttonDisplayDurationSec: 6,
                    buttonDisplayOffsetSec: 2,
                },
            },
            community: null,
            easyComment: {
                phrases: [],
            },
            external: {
                commons: {
                    hasContentTree: true,
                },
                ichiba: {
                    isEnabled: true,
                },
            },
            genre: {
                key: "anime",
                label: "\u30a2\u30cb\u30e1",
                isImmoral: false,
                isDisabled: false,
                isNotSet: false,
            },
            marquee: {
                isDisabled: false,
                tagRelatedLead: null,
            },
            media: {
                domand: null,
                delivery: null,
                deliveryLegacy: null,
            },
            okReason: "PAYMENT_PREVIEW_SUPPORTED",
            owner: null,
            payment: {
                video: {
                    isPpv: false,
                    isAdmission: true,
                    isContinuationBenefit: true,
                    isPremium: false,
                    watchableUserType: "member",
                    commentableUserType: "member",
                    billingType: "custom",
                },
                preview: {
                    ppv: {
                        isEnabled: false,
                    },
                    admission: {
                        isEnabled: true,
                    },
                    continuationBenefit: {
                        isEnabled: true,
                    },
                    premium: {
                        isEnabled: false,
                    },
                },
            },
            pcWatchPage: {
                tagRelatedBanner: null,
                videoEnd: {
                    bannerIn: null,
                    overlay: null,
                },
                showOwnerMenu: false,
                showOwnerThreadCoEditingLink: false,
                showMymemoryEditingLink: false,
                channelGtmContainerId: "",
            },
            player: {
                initialPlayback: null,
                comment: {
                    isDefaultInvisible: false,
                },
                layerMode: 0,
            },
            ppv: {
                accessFrom: null,
            },
            ranking: {
                genre: null,
                popularTag: [],
                teiban: null,
            },
            series: {
                id: 1,
                title: "Test Series",
                description: "For testing purpose only",
                thumbnailUrl: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                video: {
                    prev: {
                        type: "essential",
                        id: "sm1",
                        title: "SeriesItem",
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
                        },
                        duration: 0,
                        shortDescription: "For testing purpose only",
                        latestCommentSummary: "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                        isChannelVideo: false,
                        isPaymentRequired: false,
                        playbackPosition: null,
                        owner: {
                            ownerType: "user",
                            type: "user",
                            visibility: "visible",
                            id: "92343354",
                            name: "CYakigasi",
                            iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg",
                        },
                        requireSensitiveMasking: false,
                        videoLive: null,
                        isMuted: false,
                    },
                    next: {
                        type: "essential",
                        id: "sm1",
                        title: "SeriesItem",
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
                        },
                        duration: 0,
                        shortDescription: "For testing purpose only",
                        latestCommentSummary: "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                        isChannelVideo: false,
                        isPaymentRequired: false,
                        playbackPosition: null,
                        owner: {
                            ownerType: "user",
                            type: "user",
                            visibility: "visible",
                            id: "92343354",
                            name: "CYakigasi",
                            iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg",
                        },
                        requireSensitiveMasking: false,
                        videoLive: null,
                        isMuted: false,
                    },
                    first: {
                        type: "essential",
                        id: "sm1",
                        title: "SeriesItem",
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
                        },
                        duration: 0,
                        shortDescription: "For testing purpose only",
                        latestCommentSummary: "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                        isChannelVideo: false,
                        isPaymentRequired: false,
                        playbackPosition: null,
                        owner: {
                            ownerType: "user",
                            type: "user",
                            visibility: "visible",
                            id: "92343354",
                            name: "CYakigasi",
                            iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg",
                        },
                        requireSensitiveMasking: false,
                        videoLive: null,
                        isMuted: false,
                    },
                },
            },
            smartphone: null,
            system: {
                serverTime: "2025-10-02T19:40:16+09:00",
                isPeakTime: true,
                isStellaAlive: true,
            },
            tag: {
                items: [
                    {
                        name: "Tag0",
                        isCategory: false,
                        isCategoryCandidate: false,
                        isNicodicArticleExists: true,
                        isLocked: true,
                    },
                    {
                        name: "Tag1",
                        isCategory: false,
                        isCategoryCandidate: false,
                        isNicodicArticleExists: false,
                        isLocked: false,
                    },
                ],
                hasR18Tag: false,
                isPublishedNicoscript: false,
                edit: {
                    isEditable: false,
                    uneditableReason: "USER_FORBIDDEN",
                    editKey: null,
                },
                viewer: {
                    isEditable: false,
                    uneditableReason: "USER_FORBIDDEN",
                    editKey: null,
                },
            },
            video: {
                id: "so2",
                title: "For Admission testing purpose only",
                description: "MintWatch no tanoshimiha mugendai desu",
                count: {
                    view: 0,
                    comment: 0,
                    mylist: 0,
                    like: 0,
                },
                duration: 0,
                thumbnail: {
                    url: "https://nicovideo.cdn.nimg.jp/thumbnails/9/9",
                    middleUrl: null,
                    largeUrl: null,
                    player: "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/9/9.original/a960x540l?key=00208e6cfc9ead0306cfa0291c2734a15cdea8f58df302b5ac8ed05428ef1190",
                    ogp: "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/9/9.original/r1280x720l?key=8d46976aca8120e4969537a0c10b47590a67740a5994c11969d4ae7fa5c2bf74",
                },
                rating: {
                    isAdult: false,
                },
                registeredAt: "1970-01-01T00:00:00.000Z",
                isPrivate: false,
                isDeleted: false,
                isNoBanner: false,
                isAuthenticationRequired: true,
                isEmbedPlayerAllowed: true,
                isGiftAllowed: false,
                viewer: {
                    isOwner: false,
                    like: {
                        isLiked: false,
                        count: null,
                    },
                },
                watchableUserTypeForPayment: "member",
                commentableUserTypeForPayment: "member",
                hasLyrics: false,
            },
            videoAds: {
                additionalParams: {
                    videoId: "so2",
                    videoDuration: 0,
                    isAdultRatingNG: false,
                    isAuthenticationRequired: false,
                    isR18: false,
                    nicosid: "0",
                    lang: "ja-jp",
                    watchTrackId: "aaaaaaaaaa_0000000000000",
                    genre: "something",
                    age: 0,
                },
                items: [],
                reason: null,
            },
            videoLive: null,
            viewer: {
                id: 0,
                nickname: "TestUser",
                isPremium: true,
                allowSensitiveContents: true,
                existence: {
                    age: 0,
                    prefecture: "Earth",
                    sex: "other",
                },
            },
            waku: {
                information: null,
                bgImages: [],
                addContents: null,
                addVideo: null,
                tagRelatedBanner: {
                    title: "SomeTagEventTitle",
                    imageUrl: "",
                    description: "SomeTagEventDescription",
                    isEvent: false,
                    linkUrl: "https://www.nicovideo.jp",
                    linkType: "link",
                    linkOrigin: "https://www.nicovideo.jp",
                    isNewWindow: false,
                },
                tagRelatedMarquee: null,
                pcWatchHeaderCustomBanner: null,
            },
        },
    },
}

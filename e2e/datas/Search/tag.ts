import type { SearchTagDataRootObject } from "../../../types/search/tagData"

export const searchTagTestData: SearchTagDataRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        metadata: {
            title: "動画タグ検索「テスト」 - Testing動画",
            linkTags: [],
            metaTags: [],
            jsonLds: [],
        },
        googleTagManager: {
            user: {
                login_status: "not_login",
            },
        },
        response: {
            $getSearchVideoV2: {
                data: {
                    searchId: "",
                    totalCount: 1,
                    hasNext: true,
                    keyword: "てすと",
                    tag: null,
                    lockTag: null,
                    genres: [],
                    items: [
                        {
                            type: "essential",
                            id: "sm0",
                            title: "For testing purposes only",
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
                            duration: 186,
                            shortDescription: "TestDescriptionThatJustForTesting",
                            latestCommentSummary: "MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です MintWatchの楽しみは無限大です",
                            isChannelVideo: false,
                            isPaymentRequired: false,
                            playbackPosition: 0,
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
                        },
                    ],
                    additionals: {
                        tags: [
                            {
                                text: "MintWatchの楽しみは無限大です",
                                type: "collocation",
                            },
                        ],
                        nicoadGroups: [
                            {
                                requestId: 1,
                                nicoadNicodics: [],
                            },
                        ],
                        waku: null,
                    },
                },
            },
            page: {
                common: {
                    searchWord: "テスト",
                    searchWords: [
                        "テスト",
                    ],
                    searchType: "tag",
                    option: {
                        sort: {
                            key: [
                                {
                                    label: "\u30cb\u30b3\u30cb\u30b3\u3067\u4eba\u6c17",
                                    value: "hotLikeAndMylist",
                                    active: true,
                                    default: true,
                                    orderable: false,
                                },
                                {
                                    label: "\u3042\u306a\u305f\u3078\u306e\u304a\u3059\u3059\u3081",
                                    value: "personalized",
                                    active: false,
                                    default: false,
                                    orderable: false,
                                },
                                {
                                    label: "\u6295\u7a3f\u65e5\u6642",
                                    value: "registeredAt",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u518d\u751f\u6570",
                                    value: "viewCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u30b3\u30e1\u30f3\u30c8\u65e5\u6642",
                                    value: "lastCommentTime",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u3044\u3044\u306d\uff01\u6570",
                                    value: "likeCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u30b3\u30e1\u30f3\u30c8\u6570",
                                    value: "commentCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u30de\u30a4\u30ea\u30b9\u30c8\u767b\u9332\u6570",
                                    value: "mylistCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u518d\u751f\u6642\u9593",
                                    value: "duration",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                            ],
                            order: [
                                {
                                    label: "\u964d\u9806",
                                    value: "desc",
                                    active: true,
                                    default: true,
                                },
                                {
                                    label: "\u6607\u9806",
                                    value: "asc",
                                    active: false,
                                    default: false,
                                },
                            ],
                        },
                        presetFilter: [
                            {
                                label: "\u52d5\u753b\u7a2e\u5225",
                                query: "kind",
                                items: [
                                    {
                                        label: "\u6307\u5b9a\u306a\u3057",
                                        value: "any",
                                        active: true,
                                        default: true,
                                    },
                                    {
                                        label: "\u30e6\u30fc\u30b6\u30fc",
                                        value: "user",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30c1\u30e3\u30f3\u30cd\u30eb",
                                        value: "channel",
                                        active: false,
                                        default: false,
                                    },
                                ],
                            },
                            {
                                label: "\u518d\u751f\u6642\u9593",
                                query: "l_range",
                                items: [
                                    {
                                        label: "\u6307\u5b9a\u306a\u3057",
                                        value: 0,
                                        active: true,
                                        default: true,
                                    },
                                    {
                                        label: "5\u5206\u4ee5\u5185",
                                        value: 1,
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "20\u5206\u4ee5\u4e0a",
                                        value: 2,
                                        active: false,
                                        default: false,
                                    },
                                ],
                            },
                            {
                                label: "\u6295\u7a3f\u65e5\u6642",
                                query: "f_range",
                                items: [
                                    {
                                        label: "\u6307\u5b9a\u306a\u3057",
                                        value: 0,
                                        active: true,
                                        default: true,
                                    },
                                    {
                                        label: "1\u6642\u9593\u4ee5\u5185",
                                        value: 4,
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "24\u6642\u9593\u4ee5\u5185",
                                        value: 1,
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "1\u9031\u9593\u4ee5\u5185",
                                        value: 2,
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "1\u30f6\u6708\u4ee5\u5185",
                                        value: 3,
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "1\u5e74\u4ee5\u5185",
                                        value: 5,
                                        active: false,
                                        default: false,
                                    },
                                ],
                            },
                            {
                                label: "\u30b8\u30e3\u30f3\u30eb",
                                query: "genre",
                                items: [
                                    {
                                        label: "\u6307\u5b9a\u306a\u3057",
                                        value: "all",
                                        active: true,
                                        default: true,
                                    },
                                    {
                                        label: "\u30a8\u30f3\u30bf\u30fc\u30c6\u30a4\u30e1\u30f3\u30c8",
                                        value: "entertainment",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30e9\u30b8\u30aa",
                                        value: "radio",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u97f3\u697d\u30fb\u30b5\u30a6\u30f3\u30c9",
                                        value: "music_sound",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30c0\u30f3\u30b9",
                                        value: "dance",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u52d5\u7269",
                                        value: "animal",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u81ea\u7136",
                                        value: "nature",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u6599\u7406",
                                        value: "cooking",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u65c5\u884c\u30fb\u30a2\u30a6\u30c8\u30c9\u30a2",
                                        value: "traveling_outdoor",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u4e57\u308a\u7269",
                                        value: "vehicle",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30b9\u30dd\u30fc\u30c4",
                                        value: "sports",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u793e\u4f1a\u30fb\u653f\u6cbb\u30fb\u6642\u4e8b",
                                        value: "society_politics_news",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u6280\u8853\u30fb\u5de5\u4f5c",
                                        value: "technology_craft",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u89e3\u8aac\u30fb\u8b1b\u5ea7",
                                        value: "commentary_lecture",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30a2\u30cb\u30e1",
                                        value: "anime",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u30b2\u30fc\u30e0",
                                        value: "game",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u305d\u306e\u4ed6",
                                        value: "other",
                                        active: false,
                                        default: false,
                                    },
                                    {
                                        label: "\u4f8b\u306e\u30bd\u30ec",
                                        value: "r18",
                                        active: false,
                                        default: false,
                                    },
                                ],
                            },
                        ],
                        dateRangeFilter: {
                            start: {
                                label: "\u958b\u59cb\u65e5",
                                value: null,
                            },
                            end: {
                                label: "\u7d42\u4e86\u65e5",
                                value: null,
                            },
                        },
                    },
                    pagination: {
                        page: 1,
                        pageSize: 32,
                        totalCount: 857934,
                        maxPage: 157,
                    },
                    isImmoralSearch: false,
                },
                nicodic: {
                    url: "https://dic.nicovideo.jp/a/%E3%83%86%E3%82%B9%E3%83%88",
                    title: "\u30c6\u30b9\u30c8",
                    summary: "\u2192\u307f\u3093\u306a\u306e\u30c8\u30e9\u30a6\u30de\n\u30c6\u30b9\u30c8\u3068\u306f\u3001\u82f1\u8a9e\u306etest\u306e\u30ab\u30bf\u30ab\u30ca\u8868\u8a18\u3067\u3042\u308b\u3002\u300c\u8a66\u9a13\u300d\u300c\u8a66\u3059\u300d\u3068\u3044\u3046\u610f\u5473\u3002\n\u4eba\u9593\u306b\u5bfe\u3057\u3066\u884c\u3046\u3082\u306e\u3068\u3001\u88fd\u54c1\u3084\u30b7\u30b9\u30c6\u30e0\u306b\u5bfe\u3057\u3066\u884c\u3046\u3082\u306e\u304c\u3042\u308b\u3002\n\u5b66\u6821\u306b\u304a\u3051\u308b\u5b66\u529b\u8a66\u9a13\uff08\u5b9a\u671f\u8a66\u9a13\uff09\u3084\u3001\u8cc7",
                    advertisable: true,
                },
                nicoadGroupsRequestIdMap: {
                    nicodic: 1,
                },
                playlist: "",
            },
        },
    },
}

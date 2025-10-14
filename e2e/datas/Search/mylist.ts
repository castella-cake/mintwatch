export const searchMylistTestData: SearchListDataRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        metadata: {
            title: "マイリスト検索「TEST」 - Testing動画",
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
            $getSearchList: {
                data: {
                    searchId: "",
                    totalCount: 1,
                    hasNext: false,
                    items: [
                        {
                            type: "mylist",
                            thumbnailUrl: "",
                            videoCount: 1,
                            isMuted: false,
                            lastVideoAddedAt: "1970-01-01T00:00:00.000Z",
                            id: 0,
                            title: "TestMylist 0",
                            description: "",
                            owner: {
                                ownerType: "user",
                                type: "user",
                                visibility: "visible",
                                id: "92343354",
                                name: "CYakigasi",
                                iconUrl: "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/9234/92343354.jpg?1732190148",
                            },
                            sampleItems: [],
                            followerCount: 0,
                            isFollowing: false,
                        },
                    ],
                },
            },
            page: {
                common: {
                    searchWord: "TEST",
                    searchWords: [
                        "TEST",
                    ],
                    searchType: "mylist",
                    option: {
                        sort: {
                            key: [
                                {
                                    label: "\u30cb\u30b3\u30cb\u30b3\u3067\u4eba\u6c17",
                                    value: "_hotTotalScore",
                                    active: true,
                                    default: true,
                                    orderable: false,
                                },
                                {
                                    label: "\u767b\u9332\u52d5\u753b\u6570",
                                    value: "videoCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u4f5c\u6210\u65e5",
                                    value: "startTime",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u52d5\u753b\u8ffd\u52a0\u65e5\u6642",
                                    value: "lastAddedTime",
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
                        presetFilter: null,
                        dateRangeFilter: null,
                    },
                    pagination: {
                        page: 1,
                        pageSize: 32,
                        totalCount: 1,
                        maxPage: 1,
                    },
                    isImmoralSearch: false,
                },
            },
        },
    },
}

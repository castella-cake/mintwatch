export const searchUserTestData: SearchUserDataRootObject = {
    meta: {
        status: 200,
        code: "HTTP_200",
    },
    data: {
        metadata: {
            title: "ユーザー検索「TEST」 - Testing動画",
            linkTags: [
            ],
            metaTags: [
            ],
            jsonLds: [],
        },
        googleTagManager: {
            user: {
                login_status: "not_login",
            },
        },
        response: {
            $getSearchUser: {
                data: {
                    searchId: "",
                    totalCount: 1,
                    hasNext: false,
                    items: [
                        {
                            id: 0,
                            nickname: "TestUser 0",
                            icons: {
                                small: "",
                                large: "",
                            },
                            type: "userSearch",
                            isPremium: true,
                            description: "TestUser Description",
                            strippedDescription: "TestUser Desc",
                            shortDescription: "TestUser Desc",
                            relationships: {
                                sessionUser: {
                                    isFollowing: true,
                                },
                            },
                            followerCount: 0,
                            videoCount: 0,
                            liveCount: 0,
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
                    searchType: "user",
                    option: {
                        sort: {
                            key: [
                                {
                                    label: "\u3042\u306a\u305f\u3078\u306e\u304a\u3059\u3059\u3081",
                                    value: "_personalized",
                                    active: true,
                                    default: true,
                                    orderable: false,
                                },
                                {
                                    label: "\u30d5\u30a9\u30ed\u30ef\u30fc\u6570",
                                    value: "followerCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u6295\u7a3f\u52d5\u753b\u6570",
                                    value: "videoCount",
                                    active: false,
                                    default: false,
                                    orderable: true,
                                },
                                {
                                    label: "\u751f\u653e\u9001\u756a\u7d44\u6570",
                                    value: "liveCount",
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

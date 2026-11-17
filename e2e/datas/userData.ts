// ユーザーページ (/user/12345) のユーザーデータ
export const followTargetUserDataTestData: UserDataRootObject = {
    meta: {
        status: 200,
    },
    data: {
        user: {
            id: 12345,
            nickname: "TestFollowTarget",
            icons: {
                small: "https://example.com/icon/small/12345.png",
                large: "https://example.com/icon/large/12345.png",
            },
            description: "TestFollowTarget Description",
            decoratedDescriptionHtml: "TestFollowTarget Description",
            strippedDescription: "TestFollowTarget Desc",
            isPremium: false,
            registeredVersion: "niconico",
            followeeCount: 2,
            followerCount: 1,
            userLevel: {
                currentLevel: 1,
                nextLevelThresholdExperience: 1000,
                nextLevelExperience: 0,
                currentLevelExperience: 0,
            },
            userChannel: null,
            isNicorepoReadable: true,
            sns: [],
            coverImage: {
                ogpUrl: "https://example.com/cover/ogp/12345.png",
                pcUrl: "https://example.com/cover/pc/12345.png",
                smartphoneUrl: "https://example.com/cover/smartphone/12345.png",
            },
        },
        relationships: {
            sessionUser: {
                isFollowing: false,
            },
            isMe: false,
        },
    },
}

// マイページ (/my) の自分のユーザーデータ。isMe なのでフォローボタンは表示されない
export const myUserDataTestData: UserDataRootObject = {
    meta: {
        status: 200,
    },
    data: {
        user: {
            id: 99999,
            nickname: "TestMe",
            icons: {
                small: "https://example.com/icon/small/99999.png",
                large: "https://example.com/icon/large/99999.png",
            },
            description: "TestMe Description",
            decoratedDescriptionHtml: "TestMe Description",
            strippedDescription: "TestMe Desc",
            isPremium: false,
            registeredVersion: "niconico",
            followeeCount: 2,
            followerCount: 0,
            userLevel: {
                currentLevel: 1,
                nextLevelThresholdExperience: 1000,
                nextLevelExperience: 0,
                currentLevelExperience: 0,
            },
            userChannel: null,
            isNicorepoReadable: true,
            sns: [],
            coverImage: {
                ogpUrl: "https://example.com/cover/ogp/99999.png",
                pcUrl: "https://example.com/cover/pc/99999.png",
                smartphoneUrl: "https://example.com/cover/smartphone/99999.png",
            },
        },
        relationships: {
            sessionUser: {
                isFollowing: false,
            },
            isMe: true,
        },
    },
}

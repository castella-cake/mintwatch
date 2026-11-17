// フォロー一覧に存在するユーザーの元データ
const followeeUsers: FollowUserItem[] = [
    {
        id: 11111,
        nickname: "FollowTarget",
        icons: {
            small: "https://example.com/icon/small/11111.png",
            large: "https://example.com/icon/large/11111.png",
        },
        type: "user",
        isPremium: false,
        description: "FollowTarget Description",
        strippedDescription: "FollowTarget Desc",
        shortDescription: "FollowTarget Desc",
        relationships: {
            sessionUser: {
                isFollowing: true,
            },
        },
    },
    {
        id: 22222,
        nickname: "SecondFollowTarget",
        icons: {
            small: "https://example.com/icon/small/22222.png",
            large: "https://example.com/icon/large/22222.png",
        },
        type: "user",
        isPremium: false,
        description: "SecondFollowTarget Description",
        strippedDescription: "SecondFollowTarget Desc",
        shortDescription: "SecondFollowTarget Desc",
        relationships: {
            sessionUser: {
                isFollowing: true,
            },
        },
    },
]

export const userFolloweeIds = followeeUsers.map(user => user.id)

/**
 * フォロー中のユーザー一覧を生成する。フォロー解除したユーザーは一覧から消える
 * (モック側は再取得時にこの関数を呼び直すため、解除したユーザーが消える挙動を再現できる)
 */
export function createUserFollowingsTestData(followingIds: number[]): FollowingUserDataRootObject {
    const items = followeeUsers
        .filter(user => followingIds.includes(user.id))
        .map(user => ({
            ...user,
            relationships: {
                sessionUser: {
                    isFollowing: followingIds.includes(user.id),
                },
            },
        }))

    return {
        meta: {
            status: 200,
        },
        data: {
            items,
            summary: {
                followees: items.length,
                followers: 0,
                hasNext: false,
                cursor: "",
            },
        },
    }
}

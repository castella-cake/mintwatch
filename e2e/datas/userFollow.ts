/**
 * フォロー状態の取得(GET)用データ
 */
export function createUserFollowStatusTestData(following: boolean): UserFollowApiDataRootObject {
    return {
        meta: {
            status: 200,
        },
        data: {
            following,
        },
    }
}

/**
 * フォロー(POST)/フォロー解除(DELETE)の成功レスポンス
 * 実際のAPIはdataを含まない。UIはレスポンスのdataに依存せず操作意図で状態を更新するため、
 * ここでdataを足すと「dataがなくUIに反映されない」バグの回帰ガードにならない
 */
export const userFollowSuccessTestData: UserFollowApiDataRootObject = {
    meta: {
        status: 200,
    },
}

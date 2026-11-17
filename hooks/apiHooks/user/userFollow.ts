import { createElement } from "react"
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"

export interface UserFollowOperationParams {
    userId: string | number
    nickname?: string
    follow: boolean
}

export function useUserFollowOperation() {
    const queryClient = useQueryClient()
    const { showAlert, showToast } = useSetMessageContext()

    const mutation = useMutation<boolean, Error, UserFollowOperationParams>({
        mutationFn: ({ userId, follow }) => {
            // POST/DELETEのレスポンスはdataを持たないため、成功時は操作意図の follow をそのまま結果とする
            // ダメだったらonSuccessが発火せずにvalidateBaseResponseによってonErrorが発火する
            return userFollowApi(userId, follow ? "POST" : "DELETE").then(() => follow)
        },
        onSuccess: (following, { userId, follow }) => {
            // ユーザーページのユーザーデータ
            queryClient.setQueryData<UserDataRootObject>(["userData", userId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    data: {
                        ...old.data,
                        relationships: {
                            ...old.data.relationships,
                            sessionUser: {
                                ...old.data.relationships.sessionUser,
                                isFollowing: following,
                            },
                        },
                    },
                }
            })

            // PMWatchのフォローボタン
            queryClient.setQueryData(["userFollow", userId], following)

            // 検索結果のユーザーカード
            const searchQueries = queryClient.getQueriesData<SearchUserDataRootObject>({ queryKey: ["search", "user"] })
            for (const [key, data] of searchQueries) {
                if (!data) continue
                const items = data.data.response.$getSearchUser.data.items
                if (!items.some(item => String(item.id) === String(userId))) continue
                queryClient.setQueryData<SearchUserDataRootObject>(key, {
                    ...data,
                    data: {
                        ...data.data,
                        response: {
                            ...data.data.response,
                            $getSearchUser: {
                                ...data.data.response.$getSearchUser,
                                data: {
                                    ...data.data.response.$getSearchUser.data,
                                    items: items.map((item) => {
                                        if (String(item.id) !== String(userId)) return item
                                        return {
                                            ...item,
                                            relationships: {
                                                ...item.relationships,
                                                sessionUser: {
                                                    ...item.relationships.sessionUser,
                                                    isFollowing: following,
                                                },
                                            },
                                        }
                                    }),
                                },
                            },
                        },
                    },
                })
            }

            // 自分のフォロー中一覧。解除時はキャッシュ上で isFollowing を false に差し替えてカードをグレーアウト表示のまま残す
            // フォロー時は新規追加になるため無効化して再取得する。
            if (!follow) {
                const followingListQueries = queryClient.getQueriesData<InfiniteData<FollowingUserDataRootObject>>({ queryKey: ["user", "me", "followings"] })
                for (const [key, data] of followingListQueries) {
                    if (!data) continue
                    queryClient.setQueryData<InfiniteData<FollowingUserDataRootObject>>(key, {
                        ...data,
                        pages: data.pages.map(page => ({
                            ...page,
                            data: {
                                ...page.data,
                                items: page.data.items.map((item) => {
                                    if (String(item.id) !== String(userId)) return item
                                    return {
                                        ...item,
                                        relationships: {
                                            ...item.relationships,
                                            sessionUser: {
                                                ...item.relationships.sessionUser,
                                                isFollowing: false,
                                            },
                                        },
                                    }
                                }),
                            },
                        })),
                    })
                }
            } else {
                queryClient.invalidateQueries({ queryKey: ["user", "me", "followings"] })
            }

            // 対象ユーザーのフォロワー一覧は自分が増減するので即時無効化して再取得
            queryClient.invalidateQueries({ queryKey: ["user", userId, "followedBy"] })

            if (!follow) {
                showToast({ title: "フォローを解除しました", icon: createElement(IconCheck) })
            }
        },
        onError: error => showAlert({ icon: createElement(IconAlertTriangle), title: "フォロー操作に失敗しました", body: String(error) }),
    })

    return {
        mutate: (params: UserFollowOperationParams) => {
            if (params.follow) {
                mutation.mutate(params)
                return
            }

            const displayName = params.nickname ?? String(params.userId)
            showAlert({
                title: "このユーザーのフォローを解除",
                body: `${displayName} (ID: ${params.userId}) のフォローを解除します。よろしいですか？`,
                customCloseButton: [
                    { text: "キャンセル", key: "cancel" },
                    { text: "解除する", key: "confirm", primary: true },
                ],
                onClose: (key) => {
                    if (key === "confirm") mutation.mutate({ userId: params.userId, follow: false })
                },
            })
        },
        isPending: mutation.isPending,
    }
}

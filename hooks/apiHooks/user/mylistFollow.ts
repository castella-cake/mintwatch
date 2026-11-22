import { createElement } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"

export interface MylistFollowOperationParams {
    mylistId: number
    mylistName?: string
    follow: boolean
}

export function useMylistFollowOperation() {
    const queryClient = useQueryClient()
    const { showAlert, showToast } = useSetMessageContext()

    const mutation = useMutation<boolean, Error, MylistFollowOperationParams>({
        // mylistFollowApiのPOST/DELETEレスポンスはdataを持たないため、成功可否はthrow有無で判断し、
        // 成功時は操作意図の follow をそのまま結果とする
        mutationFn: ({ mylistId, follow }) => {
            return mylistFollowApi(mylistId, follow ? "POST" : "DELETE").then(() => follow)
        },
        onSuccess: (follow, { mylistId }) => {
            // マイリストページのデータ(ページネーション/ソートのバリエーションをプレフィックス一致で全更新)
            const mylistQueries = queryClient.getQueriesData<UserMylistResponseRootObject>({ queryKey: ["mylist", mylistId] })
            for (const [key, data] of mylistQueries) {
                if (!data) continue
                queryClient.setQueryData<UserMylistResponseRootObject>(key, {
                    ...data,
                    data: {
                        ...data.data,
                        mylist: {
                            ...data.data.mylist,
                            isFollowing: follow,
                            followerCount: data.data.mylist.followerCount + (follow ? 1 : -1),
                        },
                    },
                })
            }

            // マイページのフォロー中マイリスト一覧(フォローで追加、解除で削除される)
            queryClient.invalidateQueries({ queryKey: ["followingMylists"] })

            if (!follow) {
                showToast({ title: "フォローを解除しました", icon: createElement(IconCheck) })
            }
        },
        onError: error => showAlert({ icon: createElement(IconAlertTriangle), title: "フォロー操作に失敗しました", body: String(error) }),
    })

    return {
        mutate: (params: MylistFollowOperationParams) => {
            if (params.follow) {
                mutation.mutate(params)
                return
            }

            const displayName = params.mylistName ?? "このマイリスト"
            showAlert({
                title: "フォロー解除",
                body: `${displayName} (ID: ${params.mylistId}) のフォローを解除します。よろしいですか？`,
                customCloseButton: [
                    { text: "キャンセル", key: "cancel" },
                    { text: "解除する", key: "confirm", primary: true },
                ],
                onClose: (key) => {
                    if (key === "confirm") mutation.mutate({ mylistId: params.mylistId, follow: false })
                },
            })
        },
        isPending: mutation.isPending,
    }
}

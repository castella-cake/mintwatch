import { type IAlert, useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useUpdateMylistMutation } from "@/hooks/apiHooks/user/mylistOperations"
import { MylistForm } from "./MylistForm"

export type MylistEditTarget = Pick<UserMylistResponseRootObject["data"]["mylist"], "id" | "name" | "description" | "defaultSortKey" | "defaultSortOrder" | "isPublic">

export function openMylistEditAlert(showAlert: (alert: IAlert) => void, mylist: MylistEditTarget) {
    showAlert({
        title: "マイリスト情報を編集",
        icon: null,
        body: <MylistEditForm mylist={mylist} />,
        customCloseButton: [],
    })
}

function MylistEditForm({ mylist }: { mylist: MylistEditTarget }) {
    const { showToast } = useSetMessageContext()
    const updateMutation = useUpdateMylistMutation()

    return (
        <MylistForm
            initialValues={{
                name: mylist.name,
                description: mylist.description,
                defaultSortKey: mylist.defaultSortKey,
                defaultSortOrder: mylist.defaultSortOrder === "asc" ? "asc" : "desc",
                isPublic: mylist.isPublic,
            }}
            submitLabel="保存"
            errorPrefix="マイリストの更新に失敗しました。"
            onSubmit={async (values) => {
                await updateMutation.mutateAsync({ mylistId: mylist.id, ...values })
                showToast({ title: "マイリストを更新しました" })
                return null
            }}
        />
    )
}

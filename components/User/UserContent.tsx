import { useUserData } from "@/hooks/apiHooks/user/userData"
import { useLocationContext } from "../Router/RouterContext"
import { GenericUserDataView } from "./UserDataView/GenericUserDataView"
import { UserNavigation } from "./Navigation"

export function UserContent() {
    const location = useLocationContext()

    // URLから userId を取得 (/user/123456 のようなパス)
    const pathSegments = location.pathname.split("/")
    const userIdStr = pathSegments[2]
    const userId = userIdStr ? Number.parseInt(userIdStr, 10) : null

    const { myUserData, error, isFetching } = useUserData(userId || 0)

    if (!userId || Number.isNaN(userId)) {
        return (
            <div className="user-content-error">
                <p>無効なユーザーIDです</p>
            </div>
        )
    }

    if (isFetching) {
        return (
            <div className="user-content-loading">
                <p>読み込み中...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-content-error">
                <p>ユーザーデータの取得に失敗しました</p>
                <p>{String(error)}</p>
            </div>
        )
    }

    if (!myUserData?.data?.user) {
        return (
            <div className="user-content-error">
                <p>ユーザーデータが見つかりません</p>
            </div>
        )
    }

    return (
        <div className="user-content" data-usertype="user">
            <GenericUserDataView
                userData={myUserData.data.user}
                isMe={myUserData.data.relationships?.isMe || false}
            />
            <UserNavigation userId={userId} />
        </div>
    )
}

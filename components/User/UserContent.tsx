import { useUserData } from "@/hooks/apiHooks/user/userData"
import { useLocationContext } from "../Router/RouterContext"
import { GenericUserDataView } from "./UserDataView/GenericUserDataView"
import { UserNavigation } from "./Navigation"
import { Match } from "../Router/RouterUI"
import { TimelineContent } from "./Timeline/TimelineContent"
import { VideosContent } from "./Video/VideosContent"
import { UserVideoListsContent } from "./UserVideoLists/UserVideoListsContent"

export function UserContent() {
    const location = useLocationContext()

    // URLから userId を取得 (/user/123456 のようなパス)
    const pathSegments = location.pathname.split("/")
    const userIdStr = pathSegments[2]
    const userId = userIdStr ? Number.parseInt(userIdStr, 10) : null

    const { userData, error, isLoading } = useUserData(userId || 0)

    if (!userId || Number.isNaN(userId)) {
        return (
            <div className="user-content-error">
                <p>無効なユーザーIDです</p>
            </div>
        )
    }

    if (isLoading) {
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

    if (!userData?.data?.user) {
        return (
            <div className="user-content-error">
                <p>ユーザーデータが見つかりません</p>
            </div>
        )
    }

    return (
        <div className="user-content" data-usertype="user">
            <title>
                {userData.data.user.nickname}
                {" "}
                - ニコニコ
            </title>
            <GenericUserDataView
                userData={userData.data.user}
                isMe={userData.data.relationships?.isMe || false}
                isFollowing={userData.data.relationships.sessionUser.isFollowing || false}
            />
            <UserNavigation userId={userId} />
            <Match targetPathname={[
                `/user/${userId}!`,
                `/user/${userId}/timeline/all`,
                `/user/${userId}/timeline/postings`,
                `/user/${userId}/timeline/video`,
                `/user/${userId}/timeline/live`,
            ]}
            >
                <TimelineContent thisUserPageId={userId} />
            </Match>
            <Match targetPathname={[
                `/user/${userId}/video`,
                `/user/${userId}/shorts`,
            ]}
            >
                <VideosContent userId={userId} />
            </Match>
            <Match targetPathname={[
                `/user/${userId}/mylist`,
                `/user/${userId}/series`,
            ]}
            >
                <UserVideoListsContent userId={userId} />
            </Match>
        </div>
    )
}

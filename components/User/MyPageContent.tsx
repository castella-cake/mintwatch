import { useMyUserData } from "@/hooks/apiHooks/user/myData"
import { GenericUserDataView } from "./UserDataView/GenericUserDataView"
import { MyPageNavigation } from "./Navigation"
import { Match } from "../Router/RouterUI"
import { PublishActivities } from "../Global/Activities/PublishActivities"
import { useLocationContext } from "../Router/RouterContext"

export function MyPageContent() {
    const location = useLocationContext()
    const { myUserData, error, isFetching } = useMyUserData()

    if (isFetching) {
        return (
            <div className="mypage-content-loading">
                <p>読み込み中...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mypage-content-error">
                <p>ユーザーデータの取得に失敗しました</p>
                <p>{String(error)}</p>
            </div>
        )
    }

    if (!myUserData?.data?.user) {
        return (
            <div className="mypage-content-error">
                <p>ユーザーデータが見つかりません</p>
            </div>
        )
    }

    return (
        <div className="user-content" data-usertype="my">
            <GenericUserDataView
                userData={myUserData.data.user}
                isMe={true}
            />

            <MyPageNavigation />
            { [`/my`,
                `/my/timeline/all`,
                `/my/timeline/postings`,
                `/my/timeline/video`,
                `/my/timeline/live`].includes(location.pathname)
                && <PublishActivities context="my_timeline" />}
            <Match targetPathname="/my/history/video">

            </Match>
        </div>
    )
}

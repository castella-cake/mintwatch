import { useFollowingMylistsData } from "@/hooks/apiHooks/user/followingMylistsData"
import { MylistCard } from "../GenericComponents/MylistCard"
import "../styles/UserVideoLists.css"

export function FollowingMylists() {
    const { followingMylistsData, error, isLoading } = useFollowingMylistsData()

    if (isLoading) {
        return (
            <div className="user-following-mylists-loading">
                フォロー中のマイリストを取得中
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-following-mylists-error">
                フォロー中のマイリストの取得に失敗しました
            </div>
        )
    }

    return (
        <div className="user-videolists-body">
            <div className="user-mylists-list user-videolists-list">
                {
                    followingMylistsData?.data.mylists.map((mylist) => {
                        return (
                            <MylistCard
                                key={mylist.id}
                                mylist={mylist.detail}
                                href={`/user/${mylist.detail.owner.id}/mylist/${mylist.detail.id}`}
                                showSampleItems
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

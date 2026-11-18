import { useFollowingMylistsData } from "@/hooks/apiHooks/user/followingMylistsData"
import { MylistCard } from "../GenericComponents/MylistCard"
import "../styles/UserVideoLists.css"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function FollowingMylists() {
    const { followingMylistsData, error, isLoading } = useFollowingMylistsData()

    if (isLoading) {
        return <LoadingFiller />
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
                { followingMylistsData && followingMylistsData.data.mylists.length === 0 && (
                    <EmptyNotice contentName="フォロー中のマイリスト" />
                ) }
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

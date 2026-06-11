import { useLocationContext } from "@/components/Router/RouterContext"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { IconListNumbers, IconLock, IconWorld } from "@tabler/icons-react"

export function UserMylistsList({ showRootAnchor, showSampleItems, userId }: { showRootAnchor?: boolean, showSampleItems?: boolean, userId?: number }) {
    const location = useLocationContext()
    const { mylistsData } = useMylistsData(userId ?? "me", 3)

    if (!mylistsData) {
        return (
            <div className="user-mylists-list user-videolists-list">
                <p>マイリストを取得中...</p>
            </div>
        )
    }

    return (
        <div className="user-mylists-list user-videolists-list">
            { showRootAnchor && (
                <a
                    className="mylist-item user-videolists-item"
                    href={userId ? `/user/${userId}/mylist` : "/my/mylist"}
                    data-is-active={location.pathname === (userId ? `/user/${userId}/mylist` : "/my/mylist")}
                >
                    <div className="mylist-title user-videolists-title">
                        <span className="mylist-title-state user-videolists-title-state" title="すべてのマイリスト">
                            <IconListNumbers />
                        </span>
                        <span className="mylist-title-name user-videolists-title-name">すべてのマイリスト</span>
                    </div>
                </a>
            ) }
            {
                mylistsData.data.mylists.map((mylist) => {
                    return (
                        <a
                            key={mylist.id}
                            className="mylist-item user-videolists-item"
                            href={userId ? `/user/${userId}/mylist/${mylist.id}` : `/my/mylist/${mylist.id}`}
                            data-is-active={location.pathname === (userId ? `/user/${userId}/mylist/${mylist.id}` : `/my/mylist/${mylist.id}`)}
                        >
                            {
                                showSampleItems && mylist.sampleItems.length > 0 && (
                                    <div className="mylist-sample-container user-videolists-sample-container" data-sample-count={mylist.sampleItems.length}>
                                        {mylist.sampleItems.map(item => (
                                            <div key={item.watchId} className="mylist-sample-item user-videolists-sample-item">
                                                <img src={item.video.thumbnail.listingUrl} alt={`${mylist.name} の サンプルアイテム ${item.video.title}`} />
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            <div className="mylist-item-data user-videolists-item-data">
                                <div className="mylist-title user-videolists-title">
                                    <span className="mylist-title-state user-videolists-title-state" title={mylist.isPublic ? "公開のマイリスト" : "非公開のマイリスト"}>
                                        {mylist.isPublic ? <IconWorld /> : <IconLock />}
                                    </span>
                                    <span className="mylist-title-name user-videolists-title-name">{mylist.name}</span>
                                </div>
                                <div className="mylist-description user-videolists-description">
                                    <span className="mylist-description-count user-videolists-description-count">
                                        全
                                        {" "}
                                        {mylist.itemsCount}
                                        {" "}
                                        件
                                    </span>
                                    {" / "}
                                    <span className="mylist-description-count user-videolists-description-count">
                                        作成日時
                                        {" "}
                                        {new Date(mylist.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </div>
    )
}

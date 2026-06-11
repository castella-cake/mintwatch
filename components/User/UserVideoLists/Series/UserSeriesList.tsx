import { useLocationContext } from "@/components/Router/RouterContext"
import { useUserOwnedSeriesData } from "@/hooks/apiHooks/user/seriesData"
import { IconListNumbers } from "@tabler/icons-react"
import "../../styles/UserSeriesList.css"

export function UserSeriesList({ showRootAnchor, showThumbnail, userId }: { showRootAnchor?: boolean, showThumbnail?: boolean, userId?: number }) {
    const location = useLocationContext()
    const { ownedSeriesData } = useUserOwnedSeriesData(userId, 3)

    if (!ownedSeriesData) {
        return (
            <div className="user-series-list user-videolists-list">
                <p>シリーズを取得中...</p>
            </div>
        )
    }

    return (
        <div className="user-series-list user-videolists-list">
            { showRootAnchor && (
                <a
                    className="user-series-item user-videolists-item"
                    href={userId ? `/user/${userId}/series` : "/my/series"}
                    data-is-active={location.pathname === (userId ? `/user/${userId}/series` : "/my/series")}
                >
                    <div className="user-series-title user-videolists-title">
                        <span className="user-series-title-state user-videolists-title-state" title="すべてのシリーズ">
                            <IconListNumbers />
                        </span>
                        <span className="user-series-title-name user-videolists-title-name">すべてのシリーズ</span>
                    </div>
                </a>
            ) }
            {
                ownedSeriesData.data.items.map((series) => {
                    return (
                        <a
                            key={series.id}
                            className="user-series-item user-videolists-item"
                            href={`/user/${userId}/series/${series.id}`}
                            data-is-active={location.pathname === `/user/${userId}/series/${series.id}`}
                        >
                            { showThumbnail && (
                                <div className="user-series-thumbnail">
                                    <img src={series.thumbnailUrl} alt={`${series.title} のサムネイル`} />
                                </div>
                            ) }
                            <div className="user-series-item-data user-videolists-item-data">
                                <div className="user-series-title user-videolists-title">
                                    <span className="user-series-title-name user-videolists-title-name">{series.title}</span>
                                </div>
                                <div className="user-series-description user-videolists-description">
                                    <span className="user-series-description-count user-videolists-description-count">
                                        全
                                        {" "}
                                        {series.itemsCount}
                                        {" "}
                                        件
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

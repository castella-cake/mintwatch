import { IconLock, IconWorld } from "@tabler/icons-react"
import "../styles/UserVideoLists.css"

export function MylistCard({ mylist, href, showSampleItems, ...additionalAttributes }: {
    mylist: MylistItem
    href: string
    showSampleItems?: boolean
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            className="mylist-item user-videolists-item"
            href={href}
            {...additionalAttributes}
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
}

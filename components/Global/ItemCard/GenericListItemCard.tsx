import { Card } from "@/components/Global/InfoCard"
import { GenericListItem } from "@/types/search/listData"
import { IconListNumbers } from "@tabler/icons-react"

const typeString = {
    mylist: "マイリスト",
    series: "シリーズ",
}

export function GenericListItemCard({ list, markAsLazy, isVerticalLayout, ...additionalAttributes }: { list: GenericListItem, markAsLazy?: boolean, isVerticalLayout?: boolean }) {
    return (
        <Card
            href={`https://www.nicovideo.jp/${encodeURIComponent(list.type)}/${encodeURIComponent(list.id)}`}
            title={`${typeString[list.type]}: ${list.title}`}
            subTitle={(
                <>
                    <a className="genericitem-owner" href={list.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${list.owner.id}` : `https://www.nicovideo.jp/user/${list.owner.id}`}>
                        <img src={list.owner.iconUrl} className="genericitem-owner-icon" alt={`${list.owner.name} のアイコン`} />
                        <span className="genericitem-owner-name">{list.owner.name}</span>
                    </a>
                </>
            )}
            thumbnailUrl={(list.sampleItems && list.sampleItems[0].video.thumbnail) && list.sampleItems[0].video.thumbnail.listingUrl}
            thumbText={(
                <>
                    <IconListNumbers />
                    {list.videoCount}
                </>
            )}
            counts={(
                <>
                    <strong>{list.videoCount}</strong>
                    {" "}
                    件の動画
                    { list.type === "mylist" && (
                        <>
                            {" "}
                            /
                            {" "}
                            フォロワー
                            {" "}
                            <strong>
                                {list.followerCount}
                            </strong>
                        </>
                    )}
                </>
            )}
            thumbMarkAsLazy={markAsLazy}
            additionalClassName="mylistitem-card genericitem-card"
            data-is-vertical-layout={isVerticalLayout ? true : undefined}
            {...additionalAttributes}
        >
            <span className="info-card-content-title">
                {list.title}
            </span>
        </Card>
    )
}

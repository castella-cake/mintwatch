import { Card } from "@/components/Global/InfoCard"
import { GenericListItem } from "@/types/search/listData"
import { IconListNumbers } from "@tabler/icons-react"
import "./styles/mylistItem.css"

const typeString = {
    mylist: "マイリスト",
    series: "シリーズ",
}

export function GenericListItemCard({ list, markAsLazy, ...additionalAttributes }: { list: GenericListItem, markAsLazy?: boolean }) {
    return (
        <div className="mylistitem-wrapper" key={list.id}>
            <Card
                href={`https://www.nicovideo.jp/${encodeURIComponent(list.type)}/${encodeURIComponent(list.id)}`}
                title={`${typeString[list.type]}: ${list.title}`}
                subTitle={(
                    <>
                        <a href={list.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${list.owner.id}` : `https://www.nicovideo.jp/user/${list.owner.id}`} className="mylistitem-owner">
                            <img src={list.owner.iconUrl} className="mylistitem-owner-icon" alt={`${list.owner.name} のアイコン`} />
                            <span className="mylistitem-owner-name">{list.owner.name}</span>
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
                additionalClassName="mylistitem-card"
                {...additionalAttributes}
            >
                <span className="info-card-content-title">
                    {list.title}
                </span>
            </Card>
        </div>
    )
}

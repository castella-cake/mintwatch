import { Card } from "@/components/Global/InfoCard"
import { SearchMylistItem } from "@/types/search/mylistData"
import { IconListNumbers } from "@tabler/icons-react"
import "./styles/mylistItem.css"

export function MylistItemCard({ mylist, markAsLazy, ...additionalAttributes }: { mylist: SearchMylistItem, markAsLazy?: boolean }) {
    return (
        <div className="mylistitem-wrapper" key={mylist.id}>
            <Card
                href={`https://www.nicovideo.jp/mylist/${mylist.id}`}
                title={`マイリスト: ${mylist.title}`}
                subTitle={(
                    <>
                        <a href={mylist.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${mylist.owner.id}` : `https://www.nicovideo.jp/user/${mylist.owner.id}`} className="mylistitem-owner">
                            <img src={mylist.owner.iconUrl} className="mylistitem-owner-icon" alt={`${mylist.owner.name} のアイコン`} />
                            <span className="mylistitem-owner-name">{mylist.owner.name}</span>
                        </a>
                    </>
                )}
                thumbnailUrl={(mylist.sampleItems && mylist.sampleItems[0].video.thumbnail) && mylist.sampleItems[0].video.thumbnail.listingUrl}
                thumbText={(
                    <>
                        <IconListNumbers />
                        {mylist.videoCount}
                    </>
                )}
                counts={(
                    <>
                        <strong>{mylist.videoCount}</strong>
                        {" "}
                        件の動画 / フォロワー
                        {" "}
                        {mylist.followerCount}
                    </>
                )}
                thumbMarkAsLazy={markAsLazy}
                additionalClassName="mylistitem-card"
                {...additionalAttributes}
            >
                <span className="info-card-content-title">
                    {mylist.title}
                </span>
            </Card>
        </div>
    )
}

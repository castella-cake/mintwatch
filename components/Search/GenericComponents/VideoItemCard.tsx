import { IconClock, IconFolderFilled, IconMessageFilled, IconPlayerPlayFilled } from "@tabler/icons-react"
import { Card } from "../../Global/InfoCard"
import "./styles/videoItem.css"

export function VideoItemCard({ video, markAsLazy, ...additionalAttributes }: { video: VideoItem, markAsLazy?: boolean }) {
    return (
        <div className="videoitem-wrapper" {...additionalAttributes}>
            <Card
                href={`https://www.nicovideo.jp/watch/${encodeURIComponent(video.id)}`}
                additionalClassName="videoitem-card"
                title={video.title}
                subTitle={(
                    <>
                        <a href={video.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${video.owner.id}` : `https://www.nicovideo.jp/user/${video.owner.id}`} className="videoitem-owner">
                            <img src={video.owner.iconUrl} className="videoitem-owner-icon" alt={`${video.owner.name} のアイコン`} />
                            <span className="videoitem-owner-name">{video.owner.name}</span>
                        </a>
                    </>
                )}
                shortDescription={video.shortDescription}
                counts={(
                    <>
                        <span className="videoitem-count">
                            <IconPlayerPlayFilled />
                            {readableInt(video.count.view, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconMessageFilled />
                            {readableInt(video.count.comment, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconFolderFilled />
                            {readableInt(video.count.mylist, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconClock />
                            {relativeTimeFrom(new Date(video.registeredAt))}
                        </span>
                    </>
                )}
                thumbnailUrl={video.thumbnail.listingUrl}
                thumbText={`${secondsToTime(video.duration)}`}
                thumbMarkAsLazy={markAsLazy}
            >
                {video.title}
            </Card>
        </div>
    )
}

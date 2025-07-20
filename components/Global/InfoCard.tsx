import { IconListNumbers, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled } from "@tabler/icons-react"
import { useDraggable } from "@dnd-kit/core"
import { RecommendItem } from "@/types/RecommendData"
import { ReactNode } from "react"
import { SeriesVideoItem } from "@/types/VideoData"
import { secondsToTime } from "@/utils/readableValue"

function Draggable({ id, obj, children }: { id: string, obj: any, children: ReactNode }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: obj,
    })
    const style = {
        ...(isDragging && { pointerEvents: ("none" as React.CSSProperties["pointerEvents"]) }),
    }
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="draggable-infocard-wrapper">
            { children }
        </div>
    )
}

type CardProps = {
    href: string
    thumbnailUrl?: string
    thumbText?: string | ReactNode
    subTitle?: string | ReactNode
    additionalClassName?: string
    children?: ReactNode
    title: string
}
export function Card(props: CardProps) {
    const { href, thumbnailUrl, thumbText, subTitle: ownerName, additionalClassName, children, title, ...additionalAttribute } = props
    return (
        <div className={`info-card ${additionalClassName ?? ""}`} {...additionalAttribute}>
            <a className="info-card-link" href={href} title={title}></a>
            { (thumbText) && (
                <div className="info-card-thumbnail">
                    <img src={thumbnailUrl} alt={`${title} のサムネイル`} />
                    <span className="info-card-durationtext">{thumbText}</span>
                </div>
            )}
            { children && <div className="info-card-title">{children}</div> }
            { ownerName && <div className="info-card-owner">{ownerName}</div> }
        </div>
    )
}

export function VideoInfo({ obj, additionalQuery, isNowPlaying, isNextVideo = false }: { obj: RecommendItem, additionalQuery?: string, isNowPlaying?: boolean, isNextVideo?: boolean }) {
    const thisVideoId = obj.id || (obj.content && obj.content.id) || null

    if (!thisVideoId) return <div className="info-card">表示に失敗しました</div>
    return (
        <Draggable id={`${thisVideoId.toString()}-recommend`} obj={obj}>
            <Card
                thumbnailUrl={obj.content.thumbnail && (obj.content.thumbnail.listingUrl ?? obj.content.thumbnail.url ?? "")}
                thumbText={obj.content.duration ? secondsToTime(obj.content.duration) : "??:??"}
                subTitle={obj.content.owner.name}
                href={`https://www.nicovideo.jp/watch/${thisVideoId}${additionalQuery || ""}`}
                data-nowplaying={isNowPlaying}
                title={obj.content.title ?? "タイトル不明"}
            >
                {isNowPlaying && <span className="info-card-playingtext"><IconPlayerPlayFilled /></span> }
                { isNextVideo && <span className="info-card-playingtext"><IconPlayerSkipForwardFilled /></span>}
                <span className="info-card-content-title">
                    {obj.content.title}
                </span>
            </Card>
        </Draggable>
    )
}

export function MylistInfo(props: { obj: RecommendItem }) {
    const obj = props.obj
    return (
        <Card
            href={`https://www.nicovideo.jp/mylist/${obj.id}`}
            title={`マイリスト: ${obj.content.name}`}
            subTitle={obj.content.owner.name}
            thumbnailUrl={(obj.content.sampleItems && obj.content.sampleItems[0].video.thumbnail) && obj.content.sampleItems[0].video.thumbnail.listingUrl}
            thumbText={(
                <>
                    <IconListNumbers />
                    {obj.content.itemsCount}
                </>
            )}
        >
            <span className="info-card-content-title">
                {obj.content.name}
            </span>
        </Card>
    )
}

export function InfoCardFromRecommend({ obj, isNextVideo = false }: { obj: RecommendItem, isNextVideo?: boolean }) {
    if (obj.contentType == "video") return <VideoInfo obj={obj} isNextVideo={isNextVideo} />
    if (obj.contentType == "mylist") return <MylistInfo obj={obj} />
    return <div>Unknown contentType</div>
}

export function SeriesVideoCard({ seriesVideoItem, playlistString, transitionId, type }: { seriesVideoItem: SeriesVideoItem, playlistString: string, transitionId: string | number, type?: "next" | "first" | "prev" }) {
    return (
        <Draggable id={`${seriesVideoItem.id.toString()}-series-${type || "prev"}`} obj={seriesVideoItem}>
            <Card
                thumbnailUrl={seriesVideoItem.thumbnail && (seriesVideoItem.thumbnail.listingUrl ?? seriesVideoItem.thumbnail.url ?? "")}
                thumbText={seriesVideoItem.duration ? secondsToTime(seriesVideoItem.duration) : "??:??"}
                subTitle={seriesVideoItem.owner.name || "非公開または退会済みユーザー"}
                href={`https://www.nicovideo.jp/watch/${encodeURIComponent(seriesVideoItem.id)}?ref=series&playlist=${playlistString}&transition_type=series&transition_id=${transitionId}`}
                additionalClassName=""
                title={seriesVideoItem.title ?? "タイトル不明"}
            >
                {type === "first" && <span className="info-card-playfromfirst">シリーズの最初から連続再生</span> }
                <span className="info-card-playingtext">
                    {type === "next" ? <IconPlayerSkipForwardFilled /> : <IconPlayerSkipBackFilled />}
                    <span className="info-card-series-text">{ type === "next" ? "次の動画" : "前の動画" }</span>
                </span>
                <span className="info-card-content-title">
                    {seriesVideoItem.title}
                </span>
            </Card>
        </Draggable>
    )
}

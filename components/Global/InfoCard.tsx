import { IconCheck, IconClockFilled, IconFolderFilled, IconHeartFilled, IconListNumbers, IconMessageFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled, IconPlaylistAdd } from "@tabler/icons-react"
import { useDraggable } from "@dnd-kit/core"
import { RecommendItem } from "@/types/RecommendData"
import { ReactNode } from "react"
import { secondsToTime } from "@/utils/readableValue"
import { useControlPlaylistContext } from "./Contexts/PlaylistProvider"
import { useSetMessageContext } from "./Contexts/MessageProvider"
import { playlistVideoItem } from "../PMWatch/modules/Playlist"

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
    thumbText?: ReactNode
    thumbChildren?: ReactNode
    thumbMarkAsLazy?: boolean
    subTitle?: ReactNode
    counts?: ReactNode
    additionalClassName?: string
    children?: ReactNode
    title: string
    shortDescription?: ReactNode
    leftMarker?: ReactNode
}
export function Card(props: CardProps) {
    const {
        href,
        thumbnailUrl,
        thumbText,
        thumbChildren,
        subTitle: ownerName,
        additionalClassName,
        children,
        title,
        counts,
        shortDescription,
        leftMarker,
        thumbMarkAsLazy,
        ...additionalAttribute
    } = props
    return (
        <div className={`info-card ${additionalClassName ?? ""}`} {...additionalAttribute}>
            <a className="info-card-link" href={href} title={title}></a>
            { leftMarker && <div className="info-card-leftmarker">{leftMarker}</div>}
            { thumbnailUrl && (
                <div className="info-card-thumbnail">
                    <img src={thumbnailUrl} alt={`${title} のサムネイル`} loading={thumbMarkAsLazy ? "lazy" : undefined} />
                    { thumbText && <span className="info-card-durationtext">{thumbText}</span> }
                    {thumbChildren}
                </div>
            )}
            <div className="info-card-datacolumn">
                { children && <div className="info-card-title">{children}</div> }
                { shortDescription && <div className="info-card-desc">{shortDescription}</div>}
                { counts && <div className="info-card-counts">{counts}</div>}
                { ownerName && <div className="info-card-subtitle">{ownerName}</div> }
            </div>
        </div>
    )
}

export function VideoInfo({ obj, additionalQuery, isNowPlaying, isNextVideo = false, isExtendedView = false, ...additionalProps }: { obj: RecommendItem, additionalQuery?: string, isNowPlaying?: boolean, isNextVideo?: boolean, isExtendedView?: boolean }) {
    const thisVideoId = obj.id || (obj.content && obj.content.id) || null

    if (!thisVideoId) return <div className="info-card">表示に失敗しました</div>
    return (
        <Draggable id={`${thisVideoId.toString()}-recommend`} obj={obj}>
            <Card
                thumbnailUrl={obj.content.thumbnail && (obj.content.thumbnail.listingUrl ?? obj.content.thumbnail.url ?? "")}
                thumbText={obj.content.duration ? secondsToTime(obj.content.duration) : "??:??"}
                thumbChildren={<InfoCardAddToPlaylist obj={recommendItemToPlaylistItem(obj)} />}
                subTitle={obj.content.owner.name}
                counts={isExtendedView && obj.content.count && <InfoCardCount count={obj.content.count} registeredAt={obj.content.registeredAt} />}
                href={`https://www.nicovideo.jp/watch/${thisVideoId}${additionalQuery || ""}`}
                data-nowplaying={isNowPlaying}
                title={obj.content.title ?? "タイトル不明"}
                {...additionalProps}
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
    const { obj, ...additionalProps } = props
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
            {...additionalProps}
        >
            <span className="info-card-content-title">
                {obj.content.name}
            </span>
        </Card>
    )
}

export function LiveInfo(props: { obj: RecommendItem }) {
    const { obj, ...additionalProps } = props
    return (
        <Card
            href={`https://live.nicovideo.jp/watch/${obj.id}`}
            title={`ライブ配信: ${obj.content.title}`}
            subTitle={obj.content.owner.name}
            thumbnailUrl={obj.content.thumbnail && obj.content.thumbnail.url}
            thumbText="LIVE"
            data-is-live={true}
            {...additionalProps}
        >
            <span className="info-card-content-title">
                {obj.content.title}
            </span>
        </Card>
    )
}

export function InfoCardFromRecommend({ omitTypes = [], obj, isExtendedView, ...otherProps }: { obj: RecommendItem, isNextVideo?: boolean, isExtendedView?: boolean, omitTypes?: ("video" | "mylist" | "live")[], thumbMarkAsLazy?: boolean }) {
    if (omitTypes.some(t => t === obj.contentType)) return
    if (obj.contentType === "video") return <VideoInfo obj={obj} isExtendedView={isExtendedView} {...otherProps} />
    if (obj.contentType === "mylist") return <MylistInfo obj={obj} {...otherProps} />
    if (obj.contentType === "live") return <LiveInfo obj={obj} {...otherProps} />
    return <div>Unknown contentType</div>
}

export function SeriesVideoCard({ seriesVideoItem, playlistString, transitionId, type }: { seriesVideoItem: VideoItem, playlistString: string, transitionId: string | number, type?: "next" | "first" | "prev" }) {
    return (
        <Draggable id={`${seriesVideoItem.id.toString()}-series-${type || "prev"}`} obj={seriesVideoItem}>
            <Card
                thumbnailUrl={seriesVideoItem.thumbnail && (seriesVideoItem.thumbnail.listingUrl ?? seriesVideoItem.thumbnail.url ?? "")}
                thumbText={seriesVideoItem.duration ? secondsToTime(seriesVideoItem.duration) : "??:??"}
                thumbChildren={<InfoCardAddToPlaylist obj={seriesItemToPlaylistItem(seriesVideoItem)} />}
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

export function InfoCardCount({ count, registeredAt }: { count: GenericCount, registeredAt?: string }) {
    return (
        <>
            <span className="info-card-count" data-count-type="view">
                <IconPlayerPlayFilled />
                {readableInt(count.view, 1)}
            </span>
            <span className="info-card-count" data-count-type="comment">
                <IconMessageFilled />
                {readableInt(count.comment, 1)}
            </span>
            <span className="info-card-count" data-count-type="mylist">
                <IconFolderFilled />
                {readableInt(count.mylist, 1)}
            </span>
            <span className="info-card-count" data-count-type="like">
                <IconHeartFilled />
                {readableInt(count.like, 1)}
            </span>
            {registeredAt && (
                <span className="info-card-count" data-count-type="registeredAt">
                    <IconClockFilled />
                    {relativeTimeFrom(new Date(registeredAt))}
                </span>
            )}
        </>
    )
}

export function InfoCardAddToPlaylist({ obj }: { obj: playlistVideoItem | undefined }) {
    const { setPlaylistData } = useControlPlaylistContext()
    const { showToast } = useSetMessageContext()
    const [added, setAdded] = useState(false)
    if (!obj) return
    return (
        <div className="info-card-externalbutton-wrapper">
            <button
                className="info-card-externalbutton"
                title="再生キューに追加"
                onClick={() => {
                    setAdded(true)
                    showToast({ title: "再生キューに追加しました", icon: <IconCheck /> })
                    setPlaylistData((playlistData) => {
                        const itemsAfter = [...playlistData.items, obj]
                        return {
                            ...playlistData,
                            items: itemsAfter,
                            type: "custom",
                        }
                    })
                }}
            >
                { added ? <IconCheck /> : <IconPlaylistAdd /> }
            </button>
        </div>
    )
}

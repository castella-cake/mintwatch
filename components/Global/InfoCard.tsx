import { IconCheck, IconListNumbers, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled, IconPlaylistAdd } from "@tabler/icons-react"
import { useDraggable } from "@dnd-kit/core"
import { ReactNode } from "react"
import { secondsToTime } from "@/utils/readableValue"
import { useControlPlaylistContext } from "./Contexts/PlaylistProvider"
import { useSetMessageContext } from "./Contexts/MessageProvider"
import { playlistVideoItem } from "../PMWatch/modules/Playlist"

export function VideoQueueDraggable({ id, obj, children }: { id: string, obj: any, children: ReactNode }) {
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
    href: string | null
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
            { href !== null && <a className="info-card-link" href={href} title={title}></a> }
            { leftMarker && <div className="info-card-leftmarker">{leftMarker}</div>}
            { (thumbnailUrl || thumbChildren) && (
                <div className="info-card-thumbnail">
                    { thumbnailUrl && <img src={thumbnailUrl} alt={`${title} のサムネイル`} loading={thumbMarkAsLazy ? "lazy" : undefined} /> }
                    { thumbText && <span className="info-card-durationtext">{thumbText}</span> }
                    { thumbChildren }
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

export function MylistInfo(props: { obj: MylistItem }) {
    const { obj, ...additionalProps } = props
    return (
        <Card
            href={`https://www.nicovideo.jp/mylist/${obj.id}`}
            title={`マイリスト: ${obj.name}`}
            subTitle={obj.owner.name}
            thumbnailUrl={(obj.sampleItems && obj.sampleItems[0].video.thumbnail) && obj.sampleItems[0].video.thumbnail.listingUrl}
            thumbText={(
                <>
                    <IconListNumbers />
                    {obj.itemsCount}
                </>
            )}
            {...additionalProps}
        >
            <span className="info-card-content-title">
                {obj.name}
            </span>
        </Card>
    )
}

export function LiveInfo(props: { obj: any }) {
    const { obj, ...additionalProps } = props
    return (
        <Card
            href={`https://live.nicovideo.jp/watch/${obj.id}`}
            title={`ライブ配信: ${obj.title}`}
            subTitle={obj.owner.name}
            thumbnailUrl={obj.thumbnail && obj.thumbnail.url}
            thumbText="LIVE"
            data-is-live={true}
            {...additionalProps}
        >
            <span className="info-card-content-title">
                {obj.title}
            </span>
        </Card>
    )
}

export function SeriesVideoCard({ seriesVideoItem, playlistString, transitionId, type }: { seriesVideoItem: VideoItem, playlistString: string, transitionId: string | number, type?: "next" | "first" | "prev" }) {
    return (
        <VideoQueueDraggable id={`${seriesVideoItem.id.toString()}-series-${type || "prev"}`} obj={seriesVideoItem}>
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
        </VideoQueueDraggable>
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

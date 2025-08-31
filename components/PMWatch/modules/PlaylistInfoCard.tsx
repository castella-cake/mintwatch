import { Card } from "@/components/Global/InfoCard"
import { secondsToTime } from "@/utils/readableValue"
import { CSS } from "@dnd-kit/utilities"
import { IconCircleMinus, IconPlayerPlayFilled, IconPlayerSkipForwardFilled } from "@tabler/icons-react"
import { playlistVideoItem } from "./Playlist"
import { useSortable } from "@dnd-kit/sortable"
import { ReactNode } from "react"

function Sortable({ id, obj, children }: { id: string, obj: any, children: ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: id,
        data: obj,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging && { pointerEvents: ("none" as React.CSSProperties["pointerEvents"]), zIndex: 1000 }),
    }
    return (
        <div style={style} ref={setNodeRef} {...listeners} {...attributes} className="sortable-infocard-wrapper">
            { children }
        </div>
    )
}

export function PlaylistVideoCard({ obj, additionalQuery, isNowPlaying, markerIndex, isNextVideo = false, onRemove, isPreview = false }: { obj: playlistVideoItem, additionalQuery?: string, isNowPlaying?: boolean, markerIndex?: number, isNextVideo?: boolean, onRemove: () => void, isPreview?: boolean }) {
    return (
        <Sortable id={obj.itemId} obj={obj}>
            <Card
                thumbnailUrl={obj.thumbnailUrl}
                title={obj.title}
                href={`https://www.nicovideo.jp/watch/${obj.id}${additionalQuery || ""}`}
                thumbText={secondsToTime(obj.duration)}
                subTitle={(
                    <>
                        {obj.ownerName || "非公開または退会済みユーザー"}
                    </>
                )}
                leftMarker={(
                    <>
                        {!isNowPlaying && <button className="info-card-removebtn" onClick={onRemove} title="プレイリストから削除"><IconCircleMinus /></button>}
                        { isNowPlaying && <span className="info-card-playingtext"><IconPlayerPlayFilled /></span> }
                        { isNextVideo && <span className="info-card-playingtext"><IconPlayerSkipForwardFilled /></span>}
                        { !isNowPlaying && markerIndex !== undefined && <span className="info-card-marker-index">{markerIndex % 100 + 1}</span>}
                    </>
                )}
                data-nowplaying={isNowPlaying}
                data-is-preview={isPreview}
            >
                {obj.title}
            </Card>
        </Sortable>
    )
}

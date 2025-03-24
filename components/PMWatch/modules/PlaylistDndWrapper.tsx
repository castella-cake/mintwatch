import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Card } from "./Info/InfoCards";
import { secondsToTime } from "./commonFunction";
import { SeriesVideoItem } from "@/types/VideoData";
import { RecommendItem } from "@/types/RecommendData";
import { usePlaylistContext } from "./Contexts/PlaylistProvider";
import { arrayMove } from "@dnd-kit/sortable";
import { ReactNode } from "react";

function isValidRecommendItem(value: unknown): value is RecommendItem {
    return (
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "id") &&
        Object.prototype.hasOwnProperty.call(value, "contentType") &&
        Object.prototype.hasOwnProperty.call(value, "recommendType") &&
        Object.prototype.hasOwnProperty.call(value, "content")
    );
}

function isValidSeriesVideoItem(value: unknown): value is SeriesVideoItem {
    return (
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "type") &&
        Object.prototype.hasOwnProperty.call(value, "id") &&
        Object.prototype.hasOwnProperty.call(value, "title") &&
        Object.prototype.hasOwnProperty.call(value, "registeredAt") &&
        Object.prototype.hasOwnProperty.call(value, "count") &&
        Object.prototype.hasOwnProperty.call(value, "thumbnail") &&
        Object.prototype.hasOwnProperty.call(value, "duration") &&
        Object.prototype.hasOwnProperty.call(value, "shortDescription") &&
        Object.prototype.hasOwnProperty.call(value, "latestCommentSummary") &&
        Object.prototype.hasOwnProperty.call(value, "isChannelVideo") &&
        Object.prototype.hasOwnProperty.call(value, "isPaymentRequired") &&
        Object.prototype.hasOwnProperty.call(value, "playbackPosition") &&
        Object.prototype.hasOwnProperty.call(value, "owner") &&
        Object.prototype.hasOwnProperty.call(
            value,
            "requireSensitiveMasking",
        ) &&
        Object.prototype.hasOwnProperty.call(value, "videoLive") &&
        Object.prototype.hasOwnProperty.call(value, "isMuted")
    );
}

function CardDragOverlay({ draggingItem }: { draggingItem: unknown }) {
    if (isValidRecommendItem(draggingItem)) {
        const thisVideoId =
            (draggingItem && draggingItem.id) ||
            (draggingItem && draggingItem.content && draggingItem.content.id) ||
            null;
        return draggingItem && draggingItem.content ? (
            <Card
                thumbnailUrl={
                    draggingItem.content.thumbnail &&
                    draggingItem.content.thumbnail.listingUrl
                }
                thumbText={
                    draggingItem.content.duration
                        ? secondsToTime(draggingItem.content.duration)
                        : "??:??"
                }
                href={`https://www.nicovideo.jp/watch/${thisVideoId}`}
                title={""}
            />
        ) : null;
    } else if (isValidSeriesVideoItem(draggingItem)) {
        const seriesVideoItem = draggingItem;
        return (
            seriesVideoItem && (
                <Card
                    thumbnailUrl={
                        seriesVideoItem.thumbnail &&
                        (seriesVideoItem.thumbnail.listingUrl ??
                            seriesVideoItem.thumbnail.url ??
                            "")
                    }
                    thumbText={
                        seriesVideoItem.duration
                            ? secondsToTime(seriesVideoItem.duration)
                            : "??:??"
                    }
                    subTitle={""}
                    href={`https://www.nicovideo.jp/watch/${encodeURIComponent(seriesVideoItem.id)}`}
                    additionalClassName={""}
                    title={seriesVideoItem.title ?? "タイトル不明"}
                >
                    {seriesVideoItem.title}
                    <br />
                </Card>
            )
        );
    }
}

export function PlaylistDndWrapper({ children }: { children: ReactNode }) {
    const [currentDraggingItem, setCurrentDraggingItem] = useState<
        unknown | null
    >(null);
    const { playlistData, setPlaylistData } = usePlaylistContext();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    function handleDragEnd(e: DragEndEvent) {
        if (!playlistData) return;
        //console.log(e);
        setCurrentDraggingItem(null);
        if (
            e.over &&
            e.active.id.toString().includes("-recommend") &&
            e.active.data.current
        ) {
            const data = e.active.data.current as RecommendItem;
            if (
                !data.content ||
                !data.content.title ||
                !data.content.duration ||
                !data.content.id
            )
                return;
            const thisPlaylistObject = {
                title: data.content.title,
                id: data.content.id.toString(),
                itemId: crypto.randomUUID(),
                ownerName: data.content.owner.name,
                duration: data.content.duration,
                thumbnailUrl: data.content.thumbnail
                    ? data.content.thumbnail.listingUrl
                    : "",
            };
            setPlaylistData({
                ...playlistData,
                items: [...playlistData.items, thisPlaylistObject],
                type: "custom",
            });
        } else if (
            e.over &&
            e.active.id.toString().includes("-series") &&
            e.active.data.current
        ) {
            const data = e.active.data.current as SeriesVideoItem;
            if (!data.title || !data.duration || !data.id) return;
            const thisPlaylistObject = {
                title: data.title,
                id: data.id.toString(),
                itemId: crypto.randomUUID(),
                ownerName: data.owner.name,
                duration: data.duration,
                thumbnailUrl: data.thumbnail ? data.thumbnail.listingUrl : "",
            };
            setPlaylistData({
                ...playlistData,
                items: [...playlistData.items, thisPlaylistObject],
                type: "custom",
            });
        } else if (e.over && e.active && e.over.id !== e.active.id) {
            const currentIdList = playlistData.items.map((elem) => elem.itemId);
            const oldIndex = currentIdList.indexOf(e.active.id.toString());
            const newIndex = currentIdList.indexOf(e.over.id.toString());
            const sortAfter = arrayMove(playlistData.items, oldIndex, newIndex);
            setPlaylistData({
                ...playlistData,
                items: sortAfter,
                type: "custom",
            });
            //console.log("sortAfter", sortAfter);
        }
        //setIsDraggingInfoCard(false)
    }
    function handleDragStart(e: DragStartEvent) {
        //console.log(e)
        if (!e.active.data.current) return;
        setCurrentDraggingItem(e.active.data.current);
        //setIsDraggingInfoCard(true)
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
        >
            {children}
            <DragOverlay>
                <CardDragOverlay draggingItem={currentDraggingItem} />
            </DragOverlay>
        </DndContext>
    );
}

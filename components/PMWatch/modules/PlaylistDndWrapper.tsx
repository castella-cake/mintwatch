import {
    closestCenter,
    DndContext,
    DragCancelEvent,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Card } from "./Info/InfoCards";
import { secondsToTime } from "./commonFunction";
import { SeriesVideoItem } from "@/types/VideoData";
import { RecommendItem } from "@/types/RecommendData";
import { useControlPlaylistContext, usePlaylistContext, usePreviewPlaylistItemContext} from "@/components/Global/Contexts/PlaylistProvider";
import { arrayMove } from "@dnd-kit/sortable";
import { ReactNode } from "react";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { playlistVideoItem } from "./Playlist";
import { isValidRecommendItem } from "@/utils/playlistUtils";

let PREVIEW_UPDATE_TIMEOUT = 10

function insertPlaylistVideoItem(playlist: playlistVideoItem[], targetId: string, playlistVideoItem: playlistVideoItem) {
    const playlistCopy = [...playlist]; // arrのコピーを生成
    
    const index = playlistCopy.findIndex(obj => obj.itemId === targetId);
    
    if (index !== -1) {
        playlistCopy.splice(index + 1, 0, playlistVideoItem); // オブジェクトを挿入
    }
    
    return playlistCopy; // 変更後の配列のコピーを返す
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
                subTitle={draggingItem.content.owner.name}
            >
                {draggingItem.content.title ?? ""}
            </Card>
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
    const playlistData = usePlaylistContext()
    const previewPlaylistItem = usePreviewPlaylistItemContext()
    const { setPlaylistData, setPreviewPlaylistItem } = useControlPlaylistContext();

    const canUpdatePreviewRef = useRef<boolean>(true)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const modifiers = [snapCenterToCursor]
    const dropAnimation: DropAnimation = {
        duration: 400,
        easing: "ease",
        keyframes: ((transform) => {
            return [
                { opacity: 1, filter: "blur(0)" },
                { opacity: 0, filter: "blur(16px)" },
            ]
        }),
        /*sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0'
                }
            }
        })*/
    }

    function handleDragEnd(e: DragEndEvent) {
        //console.log(e);
        setCurrentDraggingItem(null);
        if (
            e.over &&
            e.active.id.toString().includes("-recommend") &&
            e.active.data.current
        ) {
            const data = e.active.data.current as RecommendItem;
            const thisPlaylistObject = recommendItemToPlaylistItem(data);
            if (!thisPlaylistObject) return
            let itemsAfter = [...playlistData.items, thisPlaylistObject]
            if (e.over.data.current) {
                //console.log(insertPlaylistVideoItem(playlistData.items, e.over.data.current.itemId, thisPlaylistObject))
                let overIndex = (e.over.id === "playlist-droppable-top" ? 0 : -1)
                if ( e.over.data.current ) overIndex = playlistData.items.findIndex((item) => item.itemId === e.over!.data.current!.itemId)
                if (e.over.data.current.itemId === "0") overIndex = previewPlaylistItem.index
                if (overIndex !== -1) itemsAfter = playlistData.items.toSpliced(overIndex, 0, thisPlaylistObject)
            }
            setPlaylistData((playlistData) => ({
                ...playlistData,
                items: itemsAfter,
                type: "custom",
            }));
        } else if (
            e.over &&
            e.active.id.toString().includes("-series") &&
            e.active.data.current
        ) {
            const data = e.active.data.current as SeriesVideoItem;
            const thisPlaylistObject = seriesItemToPlaylistItem(data);
            if (!thisPlaylistObject) return
            let itemsAfter = [...playlistData.items, thisPlaylistObject]
            if (e.over.data.current) {
                //console.log(insertPlaylistVideoItem(playlistData.items, e.over.data.current.itemId, thisPlaylistObject))
                let overIndex = (e.over.id === "playlist-droppable-top" ? 0 : -1)
                if ( e.over.data.current ) overIndex = playlistData.items.findIndex((item) => item.itemId === e.over!.data.current!.itemId)
                if (e.over.data.current.itemId === "0") overIndex = previewPlaylistItem.index
                if (overIndex !== -1) itemsAfter = playlistData.items.toSpliced(overIndex, 0, thisPlaylistObject)
            }
            setPlaylistData((playlistData) => ({
                ...playlistData,
                items: itemsAfter,
                type: "custom",
            }));
        } else if (e.over && e.active && e.over.id !== e.active.id) {
            setPlaylistData((playlistData) => {
                const currentIdList = playlistData.items.map((elem) => elem.itemId);
                const oldIndex = currentIdList.indexOf(e.active.id.toString());
                const newIndex = currentIdList.indexOf(e.over!.id.toString());
                const sortAfter = arrayMove(playlistData.items, oldIndex, newIndex);
                return {
                    ...playlistData,
                    items: sortAfter,
                    type: "custom",
                }
            });
            //console.log("sortAfter", sortAfter);
        }
        setPreviewPlaylistItem({ item: null, index: -1 })
        //setIsDraggingInfoCard(false)
    }
    function handleDragStart(e: DragStartEvent) {
        //console.log(e)
        if (!e.active.data.current) return;
        setCurrentDraggingItem(e.active.data.current);
        //setIsDraggingInfoCard(true)
    }
    function handleDragCancel(e: DragCancelEvent) {
        setPreviewPlaylistItem({ item: null, index: -1 })
    }
    function handleDragOver(e: DragOverEvent) {
        if (!e.over || !e.active.data.current || e.over.id === "playlist-droppable-wrapper" || !canUpdatePreviewRef.current) return
        if (
            e.active.id.toString().includes("-recommend")
        ) {
            const data = e.active.data.current as RecommendItem;
            const thisPlaylistObject = recommendItemToPlaylistItem(data);
            let overIndex = (e.over.id === "playlist-droppable-top" ? 0 : -1)
            if ( e.over.data.current ) overIndex = playlistData.items.findIndex((item) => item.itemId === e.over!.data.current!.itemId)
            if (thisPlaylistObject) {
                if (
                    (!e.over.data.current || e.over.data.current.itemId !== "0") &&
                    (
                        previewPlaylistItem.index !== overIndex ||
                        (previewPlaylistItem.item === null && overIndex === -1)
                    )
                ) setPreviewPlaylistItem({ item: { ...thisPlaylistObject, itemId: "0", isPreview: true }, index: overIndex })
                canUpdatePreviewRef.current = false
                setTimeout(() => {
                    canUpdatePreviewRef.current = true
                }, PREVIEW_UPDATE_TIMEOUT)
            } else {
                setPreviewPlaylistItem({ item: null, index: -1 })
            }
        } else if (
            e.active.id.toString().includes("-series")
        ) {
            const data = e.active.data.current as SeriesVideoItem;
            const thisPlaylistObject = seriesItemToPlaylistItem(data);
            let overIndex = (e.over.id === "playlist-droppable-top" ? 0 : -1)
            if ( e.over.data.current ) overIndex = playlistData.items.findIndex((item) => item.itemId === e.over!.data.current!.itemId)
            if (thisPlaylistObject) {
                if (
                    (!e.over.data.current || e.over.data.current.itemId !== "0") &&
                    (
                        previewPlaylistItem.item && previewPlaylistItem.item.id !== thisPlaylistObject.id || 
                        previewPlaylistItem.index !== overIndex
                    )
                ) setPreviewPlaylistItem({ item: { ...thisPlaylistObject, itemId: "0", isPreview: true }, index: overIndex })
                canUpdatePreviewRef.current = false
                setTimeout(() => {
                    canUpdatePreviewRef.current = true
                }, PREVIEW_UPDATE_TIMEOUT)
            } else {
                setPreviewPlaylistItem({ item: null, index: -1 })
            }
        } 
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragOver={handleDragOver}
            sensors={sensors}
            autoScroll={{layoutShiftCompensation: false}}
        >
            {children}
            <DragOverlay className="card-drag-overlay" modifiers={modifiers} dropAnimation={dropAnimation}>
                <CardDragOverlay draggingItem={currentDraggingItem} />
            </DragOverlay>
        </DndContext>
    );
}

import { PlaylistVideoCard } from "./PlaylistInfoCard"
import { MylistResponseRootObject } from "@/types/mylistData"
import { SeriesResponseRootObject } from "@/types/seriesData"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { IconArrowBigRightLine, IconArrowsShuffle, IconPencilMinus } from "@tabler/icons-react"
import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import { useControlPlaylistContext, usePlaylistContext, usePreviewPlaylistItemContext } from "@/components/Global/Contexts/PlaylistProvider"
import { secondsToTime } from "@/utils/readableValue"

export type playlistData = {
    type: "mylist" | "series" | "custom" | "none"
    id?: string
    items: playlistVideoItem[]
}

export type playlistVideoItem = {
    title: string
    id: string
    itemId: string
    ownerName: string | null
    duration: number
    thumbnailUrl: string
    isPreview?: boolean
}

export function mylistToSimplifiedPlaylist(obj: MylistResponseRootObject) {
    return obj.data.items.map((elem) => {
        return {
            title: elem.content.title,
            id: elem.content.id,
            itemId: elem.watchId,
            ownerName: elem.content.owner.name,
            duration: elem.content.duration,
            thumbnailUrl: elem.content.thumbnail.listingUrl,
        }
    }) as playlistVideoItem[]
}

export function seriesToSimplifiedPlaylist(obj: SeriesResponseRootObject) {
    return obj.data.items.map((elem) => {
        return {
            title: elem.video.title,
            id: elem.video.id,
            itemId: elem.meta.id,
            ownerName: elem.video.owner.name,
            duration: elem.video.duration,
            thumbnailUrl: elem.video.thumbnail.listingUrl,
        }
    })
}

const playlistTypeString = {
    mylist: "マイリストからの",
    series: "シリーズからの",
    custom: "一時的な",
    none: "",
}

function Playlist() {
    const { videoInfo } = useVideoInfoContext()
    const playlistData = usePlaylistContext()
    const previewPlaylistItem = usePreviewPlaylistItemContext()
    const { setPlaylistData } = useControlPlaylistContext()

    const { localStorage, setLocalStorageValue } = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", {
            ...localStorageRef.current.playersettings,
            [name]: value,
        })
    }
    const { setNodeRef: droppableWrapperRef } = useDroppable({
        id: "playlist-droppable-wrapper",
    })
    const { setNodeRef: droppableTopRef } = useDroppable({
        id: "playlist-droppable-top",
    })
    const { setNodeRef: droppableBottomRef } = useDroppable({
        id: "playlist-droppable-bottom",
    })

    const [isRemoveMode, setIsRemoveMode] = useState(false)

    // const [playlistData, setPlaylistData] = useState({} as any);
    const playlistQuery: { type: string, context: any } = {
        type: playlistData.type,
        context: {},
    }
    if (playlistData.type === "mylist") {
        playlistQuery.context = {
            mylistId: Number(playlistData.id),
            sortKey: "addedAt",
            sortOrder: "asc",
        }
    } else if (playlistData.type === "series") {
        playlistQuery.context = { seriesId: Number(playlistData.id) }
    }
    const query = encodeURIComponent(btoa(JSON.stringify(playlistQuery)))
    function onRandomShuffle() {
        const currentShufflePlayState
            = localStorage.playersettings.enableShufflePlay ?? false
        writePlayerSettings("enableShufflePlay", !currentShufflePlayState)
    }

    function onContinuousPlayToggle() {
        const currentContinuousPlayState
            = localStorage.playersettings.enableContinuousPlay ?? true
        writePlayerSettings("enableContinuousPlay", !currentContinuousPlayState)
    }
    function removeVideo(index: number) {
        const playlistItemsAfter = playlistData.items.filter(
            (_, i) => i !== index,
        )
        setPlaylistData({
            ...playlistData,
            items: playlistItemsAfter,
            type: "custom",
        })
    }

    let extendedItems = playlistData.items
    if (previewPlaylistItem.item && !playlistData.items.some(item => item.itemId === previewPlaylistItem.item!.itemId)) {
        if (previewPlaylistItem.index !== -1) {
            extendedItems = playlistData.items.toSpliced(previewPlaylistItem.index, 0, previewPlaylistItem.item)
        } else {
            extendedItems = [...playlistData.items, previewPlaylistItem.item]
        }
    }

    const estimatedDuration = playlistData.items.reduce((acc, item) => acc + item.duration, 0)

    return (
        <div
            className="playlist-container"
            id="pmw-playlist"
            ref={droppableWrapperRef}
        >
            <div className="playlist-title-container global-flex stacker-title">
                <div className="playlist-title global-flex1 global-bold">
                    {playlistTypeString[playlistData.type]}
                    再生キュー
                    <span className="stacker-subtitle">
                        (
                        {extendedItems.length}
                        {" "}
                        動画 /
                        {secondsToTime(estimatedDuration)}
                        )
                    </span>
                </div>
                <button
                    title={
                        (isRemoveMode ?? false)
                            ? "削除モードを終了"
                            : "再生キューからアイテムを削除"
                    }
                    onClick={() => setIsRemoveMode(!isRemoveMode)}
                    data-isenabled={
                        isRemoveMode.toString()
                    }
                >
                    <IconPencilMinus />
                </button>
                <button
                    title={
                        (localStorage.playersettings.enableContinuousPlay ?? true)
                            ? "連続再生を無効化"
                            : "連続再生を有効化"
                    }
                    onClick={onContinuousPlayToggle}
                    data-isenabled={
                        localStorage.playersettings.enableContinuousPlay ?? true
                    }
                >
                    <IconArrowBigRightLine />
                </button>
                <button
                    title={
                        (localStorage.playersettings.enableShufflePlay ?? false)
                            ? "シャッフル再生を無効化"
                            : "シャッフル再生を有効化"
                    }
                    onClick={onRandomShuffle}
                    data-isenabled={
                        localStorage.playersettings.enableShufflePlay ?? false
                    }
                >
                    <IconArrowsShuffle />
                </button>
            </div>
            <SortableContext
                items={extendedItems.map(elem => elem.itemId)}
            >

                <div className="playlist-items-container" data-is-removemode={isRemoveMode.toString()}>
                    <div className="playlist-droppable-area-upper" ref={droppableTopRef}></div>
                    {extendedItems.length > 0
                        && extendedItems?.map((item, index) => {
                            const isNowPlaying
                                = videoInfo?.data?.response.video.id === item.id
                            return (
                                <PlaylistVideoCard
                                    key={`playlist-${item.itemId}`}
                                    obj={item}
                                    additionalQuery={`?playlist=${query}`}
                                    isNowPlaying={isNowPlaying}
                                    onRemove={() => removeVideo(index)}
                                    isPreview={item.isPreview ?? false}
                                />
                            )
                        })}
                    <div className="playlist-droppable-area-lower" ref={droppableBottomRef}></div>
                </div>

                {extendedItems.length < 2 && (
                    <div className="playlist-nothinghere">
                        <p>
                            ここに動画をドラッグ&ドロップして再生キューに追加...
                        </p>
                    </div>
                )}
            </SortableContext>
        </div>
    )
}

export default Playlist

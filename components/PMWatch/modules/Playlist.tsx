import { PlaylistVideoCard } from "./Info/InfoCards";
import { MylistResponseRootObject } from "@/types/mylistData";
import { SeriesResponseRootObject } from "@/types/seriesData";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { IconArrowsShuffle, IconPencilMinus } from "@tabler/icons-react";
import { useVideoInfoContext } from "./Contexts/VideoDataProvider";
import { usePlaylistContext } from "./Contexts/PlaylistProvider";

export type playlistData = {
    type: "mylist" | "series" | "custom" | "none";
    id?: string;
    items: playlistVideoItem[];
};

export type playlistVideoItem = {
    title: string;
    id: string;
    itemId: string;
    ownerName: string | null;
    duration: number;
    thumbnailUrl: string;
};

export function mylistToSimplifiedPlaylist(obj: MylistResponseRootObject) {
    return obj.data.items.map((elem) => {
        return {
            title: elem.content.title,
            id: elem.content.id,
            itemId: elem.watchId,
            ownerName: elem.content.owner.name,
            duration: elem.content.duration,
            thumbnailUrl: elem.content.thumbnail.listingUrl,
        };
    }) as playlistVideoItem[];
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
        };
    });
}

const playlistTypeString = {
    mylist: "マイリストからの",
    series: "シリーズからの",
    custom: "カスタムの",
    none: "",
};

function Playlist() {
    const { videoInfo } = useVideoInfoContext();
    const { playlistData, setPlaylistData } = usePlaylistContext();

    const { localStorage, setLocalStorageValue } = useStorageContext();
    const localStorageRef = useRef<any>(null);
    localStorageRef.current = localStorage;
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", {
            ...localStorageRef.current.playersettings,
            [name]: value,
        });
    }
    const { setNodeRef, isOver } = useDroppable({
        id: "playlist-droppable",
    });

    const [isRemoveMode, setIsRemoveMode] = useState(false);

    //const [playlistData, setPlaylistData] = useState({} as any);
    let playlistQuery: { type: string; context: any } = {
        type: playlistData.type,
        context: {},
    };
    if (playlistData.type === "mylist") {
        playlistQuery.context = {
            mylistId: Number(playlistData.id),
            sortKey: "addedAt",
            sortOrder: "asc",
        };
    } else if (playlistData.type === "series") {
        playlistQuery.context = { seriesId: Number(playlistData.id) };
    }
    const query = encodeURIComponent(btoa(JSON.stringify(playlistQuery)));
    function onRandomShuffle() {
        const currentShufflePlayState =
            localStorage.playersettings.enableShufflePlay ?? false;
        writePlayerSettings("enableShufflePlay", !currentShufflePlayState);
        /*
        const playlistItems = playlistData.items.slice();
        // シャッフルしてから先頭を現在の動画に
        for ( const [index, item] of playlistItems.entries() ) {
            const randomIndex = Math.floor(Math.random() * playlistItems.length);
            const randomItem = playlistItems[randomIndex];
            playlistItems[randomIndex] = item;
            playlistItems[index] = randomItem;
        }
        const currentVideoIndex = playlistItems.findIndex( item => videoInfo?.data?.response.video.id === item.id )
        const currentVideoItem = playlistItems[currentVideoIndex];
        const currentFirstVideoItem = playlistItems[0];
        playlistItems[0] = currentVideoItem;
        playlistItems[currentVideoIndex] = currentFirstVideoItem;

        setPlaylistData({ ...playlistData, type: "custom", items: playlistItems });*/
    }
    function removeVideo(index: number) {
        const playlistItemsAfter = playlistData.items.filter(
            (_, i) => i !== index,
        );
        setPlaylistData({
            ...playlistData,
            items: playlistItemsAfter,
            type: "custom",
        });
    }

    return (
        <div
            className={`playlist-container`}
            id="pmw-playlist"
            ref={setNodeRef}
        >
            <div className="playlist-title-container global-flex stacker-title">
                <div className="playlist-title global-flex1 global-bold">
                    {playlistTypeString[playlistData.type]}再生キュー
                    {playlistData.type === "custom" ? " (一時的)" : ""}
                </div>
                <button
                    title={
                        (isRemoveMode ?? false)
                            ? "削除モードを終了"
                            : "プレイリストからアイテムを削除"
                    }
                    onClick={() => setIsRemoveMode(!isRemoveMode)}
                    data-isenable={
                        isRemoveMode.toString()
                    }
                >
                    <IconPencilMinus />
                </button>
                <button
                    title={
                        (localStorage.playersettings.enableShufflePlay ?? false)
                            ? "シャッフル再生を無効化"
                            : "シャッフル再生を有効化"
                    }
                    onClick={onRandomShuffle}
                    data-isenable={
                        localStorage.playersettings.enableShufflePlay ?? false
                    }
                >
                    <IconArrowsShuffle />
                </button>
            </div>
            <SortableContext
                items={playlistData.items.map((elem) => elem.itemId)}
            >
                <div className="playlist-items-container" data-is-removemode={isRemoveMode.toString()}>
                    {playlistData.items.length > 0 &&
                        playlistData.items?.map((item, index) => {
                            const isNowPlaying =
                                videoInfo?.data?.response.video.id === item.id;
                            return (
                                <PlaylistVideoCard
                                    key={`playlist-${item.itemId}`}
                                    obj={item}
                                    additionalQuery={`?playlist=${query}`}
                                    isNowPlaying={isNowPlaying}
                                    onRemove={() => removeVideo(index)}
                                />
                            );
                        })}
                </div>
                {playlistData.items.length < 2 && (
                    <div className="playlist-nothinghere">
                        <p>
                            ここに動画をドラッグ&ドロップしてプレイリストに追加...
                        </p>
                    </div>
                )}
            </SortableContext>
            {isOver && (
                <div className="playlist-dropavailablehint">
                    ここにドロップして動画を最後尾に追加...
                </div>
            )}
        </div>
    );
}

export default Playlist;

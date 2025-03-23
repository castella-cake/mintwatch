import { mylistContext, playlistQueryData } from "@/types/playlistQuery";
import { useVideoInfoContext } from "./VideoDataProvider";
import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import {
    mylistToSimplifiedPlaylist,
    playlistData,
    seriesToSimplifiedPlaylist,
} from "../Playlist";
import { SeriesResponseRootObject } from "@/types/seriesData";

type PlaylistContext = {
    playlistData: playlistData;
    setPlaylistData: Dispatch<SetStateAction<playlistData>>;
    updatePlaylistState: (search?: string) => void;
};
const IPlaylistContext = createContext<PlaylistContext>({
    playlistData: { type: "none", items: [] },
    setPlaylistData: () => {},
    updatePlaylistState: (search?: string) => {},
});

export function PlaylistProvider({ children }: { children: ReactNode }) {
    const { videoInfo } = useVideoInfoContext();
    const [playlistData, setPlaylistData] = useState<playlistData>({
        type: "none",
        items: [],
    });

    function updatePlaylistState(search = location.search) {
        const searchParams = new URLSearchParams(search);
        const playlistString = searchParams.get("playlist");
        //console.log(playlistString)

        async function getData(playlistJson: playlistQueryData) {
            //console.log(playlistJson.context.mylistId)

            if (
                playlistJson.type === "mylist" &&
                playlistJson.context.mylistId
            ) {
                // fetchしようとしているマイリストが、すでにフェッチ済みのマイリストと同一ならスキップする
                if (playlistData.id === playlistJson.context.mylistId) return;

                const context: mylistContext = playlistJson.context;
                const response: any = await getMylist(
                    context.mylistId,
                    "registeredAt",
                    "desc",
                );
                //console.log(response);
                //setFetchedPlaylistData(response)
                setPlaylistData({
                    type: "mylist",
                    id: response.data.id.value,
                    items: mylistToSimplifiedPlaylist(response),
                });
            } else if (
                playlistJson.type === "series" &&
                playlistJson.context.seriesId
            ) {
                const response: SeriesResponseRootObject = await getSeriesInfo(
                    playlistJson.context.seriesId,
                );
                console.log(response);
                setPlaylistData({
                    type: "series",
                    id: playlistJson.context.seriesId,
                    items: seriesToSimplifiedPlaylist(response),
                });
            } else if (videoInfo) {
                //setFetchedPlaylistData(null)
                setPlaylistData({ type: "none", items: [] });
            }
        }

        if (playlistString && playlistData.type !== "custom") {
            const decodedPlaylist = atob(
                playlistString.replace("-", "+").replace("_", "/"),
            );
            const playlistJson: playlistQueryData = JSON.parse(decodedPlaylist);
            //setCurrentPlaylist(playlistJson)
            getData(playlistJson);
        }
        if (
            videoInfo &&
            (playlistData.type === "none" ||
                (playlistData.type === "custom" &&
                    playlistData.items.length < 2))
        ) {
            const ownerName =
                videoInfo.data.response.owner &&
                videoInfo.data.response.owner.nickname;
            const channelName =
                videoInfo.data.response.channel &&
                videoInfo.data.response.channel.name;
            setPlaylistData({
                type: "custom",
                items: [
                    {
                        title: videoInfo.data.response.video.title,
                        id: videoInfo.data.response.video.id,
                        itemId: crypto.randomUUID(),
                        ownerName:
                            ownerName ??
                            channelName ??
                            "非公開または退会済みユーザー",
                        duration: videoInfo.data.response.video.duration,
                        thumbnailUrl:
                            videoInfo.data.response.video.thumbnail.middleUrl ??
                            videoInfo.data.response.video.thumbnail.url,
                    },
                ],
            });
        }
    }

    return (
        <IPlaylistContext.Provider
            value={{
                playlistData,
                setPlaylistData,
                updatePlaylistState,
            }}
        >
            {children}
        </IPlaylistContext.Provider>
    );
}

export function usePlaylistContext() {
    return useContext(IPlaylistContext);
}

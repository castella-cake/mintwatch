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

    function setInitialPlaylistState() {
        if (!videoInfo) return
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

    function updatePlaylistState(search = location.search) {
        // URLのクエリパラメータを引っ張ってくる。playlistにはbase64でエンコードされたプレイリストの情報が入っている。
        const searchParams = new URLSearchParams(search);
        const playlistString = searchParams.get("playlist");
        //console.log(playlistString)

        // プレイリストの情報からマイリストもしくはシリーズのデータを取得する関数
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
                // fetchしようとしているマイリストが、すでにフェッチ済みのシリーズと同一ならスキップする
                //console.log(playlistData.id, playlistJson.context.seriesId)
                if (playlistData.id === playlistJson.context.seriesId) return;
                const response: SeriesResponseRootObject = await getSeriesInfo(
                    playlistJson.context.seriesId,
                );
                //console.log(response);
                setPlaylistData({
                    type: "series",
                    id: playlistJson.context.seriesId,
                    items: seriesToSimplifiedPlaylist(response),
                });
            } else if (videoInfo) {
                //setFetchedPlaylistData(null)
                setInitialPlaylistState()
            }
        }
        if (playlistString && (playlistData.type === "none" || (playlistData.type === "custom" && playlistData.items.length < 2))) {
            // プレイリスト情報があり、カスタムプレイリストではない場合にデータを取得
            const decodedPlaylist = atob(
                playlistString.replace("-", "+").replace("_", "/"),
            );
            const playlistJson: playlistQueryData = JSON.parse(decodedPlaylist);
            //setCurrentPlaylist(playlistJson)
            getData(playlistJson);
        } else if (!playlistString && (playlistData.type === "none" || (playlistData.type === "custom" && playlistData.items.length < 2))) {
            setInitialPlaylistState()
        }
    }

    useEffect(() => {
        // 初回レンダリングで今のプレイリスト状態を設定
        if (videoInfo) updatePlaylistState();

        // 戻るボタンとかが発生した場合
        const onPopState = () => {
            if (videoInfo) updatePlaylistState();
        };
        window.addEventListener("popstate", onPopState);
        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, [videoInfo]);

    return (
        <IPlaylistContext
            value={{
                playlistData,
                setPlaylistData,
                updatePlaylistState,
            }}
        >
            {children}
        </IPlaylistContext>
    );
}

export function usePlaylistContext() {
    return useContext(IPlaylistContext);
}

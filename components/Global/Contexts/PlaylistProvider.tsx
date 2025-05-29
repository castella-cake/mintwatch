import { mylistContext, playlistQueryData } from "@/types/playlistQuery";
import { useVideoInfoContext } from "./VideoDataProvider";
import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import {
    mylistToSimplifiedPlaylist,
    playlistData,
    playlistVideoItem,
    seriesToSimplifiedPlaylist,
} from "../../PMWatch/modules/Playlist";
import { useQueryClient } from "@tanstack/react-query";

const IPlaylistContext = createContext<playlistData>({ type: "none", items: [] });

const IPreviewPlaylistItemContext = createContext<{ item: playlistVideoItem | null, index: number }>({ item: null, index: -1 })

type ControlPlaylistContext = {
    setPlaylistData: Dispatch<SetStateAction<playlistData>>;
    updatePlaylistState: (search?: string) => void;
    setPreviewPlaylistItem: Dispatch<SetStateAction<{ item: playlistVideoItem | null, index: number }>>;
}
const IControlPlaylistContext = createContext<ControlPlaylistContext>({
    setPlaylistData: () => {},
    updatePlaylistState: (search?: string) => {},
    setPreviewPlaylistItem: () => {},
})

export function PlaylistProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const { videoInfo } = useVideoInfoContext();
    const [_playlistData, setPlaylistData] = useState<playlistData>({
        type: "none",
        items: [],
    });
    const [previewPlaylistItem, setPreviewPlaylistItem] = useState<{ item: playlistVideoItem | null, index: number }>({ item: null, index: -1 })
    
    // また会ったな！！ 今回はsetStateActionではasyncが使えない、
    // またuseCallbackを使わないとの関係ないStateの更新時に巻き込んで再レンダリングされるため必要だった
    const _playlistDataRef = useRef(_playlistData)
    useEffect(() => {
        _playlistDataRef.current = _playlistData
    }, [_playlistData])

    const setInitialPlaylistState = useCallback(() => {
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
    }, [videoInfo])

    const updatePlaylistState = useCallback((search = location.search) => {
        // URLのクエリパラメータを引っ張ってくる。playlistにはbase64でエンコードされたプレイリストの情報が入っている。
        const searchParams = new URLSearchParams(search);
        const playlistString = searchParams.get("playlist");
        //console.log(playlistString)
        const currentPlaylistData = _playlistDataRef.current

        // プレイリストの情報からマイリストもしくはシリーズのデータを取得する関数
        async function getData(playlistJson: playlistQueryData) {
            //console.log(playlistJson.context.mylistId)
            if (
                playlistJson.type === "mylist" &&
                playlistJson.context.mylistId
            ) {
                // fetchしようとしているマイリストが、すでにフェッチ済みのマイリストと同一ならスキップする
                if (currentPlaylistData.id === playlistJson.context.mylistId) return;

                const context: mylistContext = playlistJson.context;
                const response = await queryClient.fetchQuery({
                    queryKey: ["mylist", context],
                    queryFn: () => getMylist(
                        context.mylistId,
                        context.sortKey ?? "registeredAt",
                        context.sortOrder ?? "desc",
                    )
                })
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
                if (currentPlaylistData.id === playlistJson.context.seriesId) return;
                const response = await queryClient.fetchQuery({
                    queryKey: ["series", playlistJson.context.seriesId],
                    queryFn: () => getSeriesInfo(playlistJson.context.seriesId)
                })
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
        if (playlistString && (currentPlaylistData.type === "none" || (currentPlaylistData.type === "custom" && currentPlaylistData.items.length < 2))) {
            // プレイリスト情報があり、カスタムプレイリストではない場合にデータを取得
            const decodedPlaylist = atob(
                playlistString.replace("-", "+").replace("_", "/"),
            );
            const playlistJson: playlistQueryData = JSON.parse(decodedPlaylist);
            //setCurrentPlaylist(playlistJson)
            getData(playlistJson);
        } else if (!playlistString && (currentPlaylistData.type === "none" || (currentPlaylistData.type === "custom" && currentPlaylistData.items.length < 2))) {
            setInitialPlaylistState()
        }
    }, [_playlistData, videoInfo])

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

    const controlFunctionsMemo = useMemo(() => ({
        setPlaylistData,
        updatePlaylistState,
        setPreviewPlaylistItem,
    }), [videoInfo, _playlistData])

    return (
        <IControlPlaylistContext value={controlFunctionsMemo}>
            <IPlaylistContext
                value={_playlistData}
            >
                <IPreviewPlaylistItemContext value={previewPlaylistItem}>
                    {children}
                </IPreviewPlaylistItemContext>
            </IPlaylistContext>
        </IControlPlaylistContext>
    );
}

export function usePlaylistContext() {
    return useContext(IPlaylistContext);
}

export function usePreviewPlaylistItemContext() {
    return useContext(IPreviewPlaylistItemContext);
}


export function useControlPlaylistContext() {
    return useContext(IControlPlaylistContext);
}

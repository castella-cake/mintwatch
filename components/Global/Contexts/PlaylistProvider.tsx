import { mylistContext, playlistQueryData, searchContext } from "@/types/playlistQuery"
import { useVideoInfoContext } from "./VideoDataProvider"
import { createContext, Dispatch, ReactNode, SetStateAction } from "react"
import {
    playlistData,
    playlistToSimplifiedPlaylist,
    playlistVideoItem,
    seriesToSimplifiedPlaylist,
} from "../../PMWatch/modules/Playlist"
import { decodePlaylistString, rotatePlaylistToStart } from "@/utils/playlistUtils"
import { useQueryClient } from "@tanstack/react-query"

const IPlaylistContext = createContext<playlistData>({ type: "none", items: [] })

const IPreviewPlaylistItemContext = createContext<{ item: playlistVideoItem | null, index: number }>({ item: null, index: -1 })

type ControlPlaylistContext = {
    setPlaylistData: Dispatch<SetStateAction<playlistData>>
    updatePlaylistState: (search?: string) => void
    setPreviewPlaylistItem: Dispatch<SetStateAction<{ item: playlistVideoItem | null, index: number }>>
}
const IControlPlaylistContext = createContext<ControlPlaylistContext>({
    setPlaylistData: () => {},
    updatePlaylistState: () => {},
    setPreviewPlaylistItem: () => {},
})

export function PlaylistProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const { videoInfo } = useVideoInfoContext()
    const [_playlistData, setPlaylistData] = useState<playlistData>({
        type: "none",
        items: [],
    })
    const [previewPlaylistItem, setPreviewPlaylistItem] = useState<{ item: playlistVideoItem | null, index: number }>({ item: null, index: -1 })

    const setInitialPlaylistState = useCallback(() => {
        if (!videoInfo) return
        const ownerName
            = videoInfo.data.response.owner
                && videoInfo.data.response.owner.nickname
        const channelName
            = videoInfo.data.response.channel
                && videoInfo.data.response.channel.name
        setPlaylistData({
            type: "custom",
            items: [
                {
                    title: videoInfo.data.response.video.title,
                    id: videoInfo.data.response.video.id,
                    itemId: crypto.randomUUID(),
                    ownerName:
                        ownerName
                        ?? channelName
                        ?? "非公開または退会済みユーザー",
                    duration: videoInfo.data.response.video.duration,
                    thumbnailUrl:
                        videoInfo.data.response.video.thumbnail.middleUrl
                        ?? videoInfo.data.response.video.thumbnail.url,
                },
            ],
        })
    }, [videoInfo])

    const updatePlaylistState = useCallback((search = location.search) => {
        // URLのクエリパラメータを引っ張ってくる。playlistにはbase64でエンコードされたプレイリストの情報が入っている。
        const searchParams = new URLSearchParams(search)
        const playlistString = searchParams.get("playlist")
        // console.log(playlistString)
        const currentPlaylistData = _playlistData

        // プレイリストの情報からマイリストもしくはシリーズ、検索のデータを取得する関数
        async function getData(playlistJson: playlistQueryData) {
            // console.log(playlistJson.context.mylistId)
            if (
                playlistJson.type === "mylist"
                && playlistJson.context.mylistId
            ) {
                // fetchしようとしているマイリストが、すでにフェッチ済みのマイリストと同一ならスキップする
                if (currentPlaylistData.id === playlistJson.context.mylistId) return

                const context: mylistContext = playlistJson.context
                const response = await queryClient.fetchQuery({
                    queryKey: ["mylist", context],
                    queryFn: () => getMylistAsPlaylist(
                        context.mylistId,
                        context.sortKey ?? "registeredAt",
                        context.sortOrder ?? "desc",
                    ),
                })
                // console.log(response);
                // setFetchedPlaylistData(response)
                setPlaylistData({
                    type: "mylist",
                    id: response.data.id.value,
                    name: response.data.meta.title,
                    items: playlistToSimplifiedPlaylist(response),
                })
            } else if (
                playlistJson.type === "series"
                && playlistJson.context.seriesId
            ) {
                // fetchしようとしているマイリストが、すでにフェッチ済みのシリーズと同一ならスキップする
                // console.log(playlistData.id, playlistJson.context.seriesId)
                if (currentPlaylistData.id === playlistJson.context.seriesId) return
                const response = await queryClient.fetchQuery({
                    queryKey: ["series", playlistJson.context.seriesId],
                    queryFn: () => getSeriesInfo(playlistJson.context.seriesId),
                })
                // console.log(response);
                setPlaylistData({
                    type: "series",
                    id: playlistJson.context.seriesId,
                    name: response.data.detail.title,
                    items: seriesToSimplifiedPlaylist(response),
                })
            } else if (
                playlistJson.type === "search"
                && playlistJson.context
            ) {
                // fetchしようとしている検索プレイリストが、すでにフェッチ済みのものと同一ならスキップする
                if (currentPlaylistData.id === playlistString) return

                const context: searchContext = playlistJson.context
                const response = await queryClient.fetchQuery({
                    queryKey: ["searchPlaylist", context],
                    queryFn: () => getSearchPlaylist(context),
                })
                // クリックした動画を先頭にして再生するため、現在の動画を先頭に巡回させる
                const currentVideoId = videoInfo?.data?.response.video.id
                const items = rotatePlaylistToStart(
                    playlistToSimplifiedPlaylist(response),
                    currentVideoId,
                )
                setPlaylistData({
                    type: "search",
                    id: playlistString ?? undefined,
                    name: response.data.meta.title,
                    items,
                })
            } else if (videoInfo) {
                // setFetchedPlaylistData(null)
                setInitialPlaylistState()
            }
        }
        if (playlistString && (currentPlaylistData.type === "none" || (currentPlaylistData.type === "custom" && currentPlaylistData.items.length < 2))) {
            // プレイリスト情報があり、カスタムプレイリストではない場合にデータを取得
            const playlistJson: playlistQueryData = decodePlaylistString(playlistString)
            // setCurrentPlaylist(playlistJson)
            getData(playlistJson)
        } else if (!playlistString && (currentPlaylistData.type === "none" || (currentPlaylistData.type === "custom" && currentPlaylistData.items.length < 2))) {
            setInitialPlaylistState()
        }
    }, [_playlistData, videoInfo])

    useEffect(() => {
        // 初回レンダリングで今のプレイリスト状態を設定
        if (videoInfo) updatePlaylistState()

        // 戻るボタンとかが発生した場合
        const onPopState = () => {
            if (videoInfo) updatePlaylistState()
        }
        window.addEventListener("popstate", onPopState)
        return () => {
            window.removeEventListener("popstate", onPopState)
        }
    }, [videoInfo])

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
    )
}

export function usePlaylistContext() {
    return useContext(IPlaylistContext)
}

export function usePreviewPlaylistItemContext() {
    return useContext(IPreviewPlaylistItemContext)
}

export function useControlPlaylistContext() {
    return useContext(IControlPlaylistContext)
}

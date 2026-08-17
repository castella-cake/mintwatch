import { mylistContext, playlistQueryData, searchContext } from "@/types/playlistQuery"
import { VideoDataRootObject } from "@/types/VideoData"
import { useVideoInfoContext } from "./VideoDataProvider"
import { useLocationContext } from "@/components/Router/RouterContext"
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
    setPreviewPlaylistItem: Dispatch<SetStateAction<{ item: playlistVideoItem | null, index: number }>>
}
const IControlPlaylistContext = createContext<ControlPlaylistContext>({
    setPlaylistData: () => {},
    setPreviewPlaylistItem: () => {},
})

// プレイリストが未設定、または自動生成されたもの(現在の動画のみ)でカスタマイズされていないかどうかを返す
function isUnsetOrTrivial(playlistData: playlistData) {
    return playlistData.type === "none"
        || (playlistData.type === "custom" && playlistData.items.length < 2)
}

// 現在の動画のみからなる初期プレイリストを生成する
function buildInitialPlaylist(videoInfo: VideoDataRootObject): playlistData {
    const ownerName
        = videoInfo.data.response.owner
            && videoInfo.data.response.owner.nickname
    const channelName
        = videoInfo.data.response.channel
            && videoInfo.data.response.channel.name
    return {
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
    }
}

export function PlaylistProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const { videoInfo } = useVideoInfoContext()
    const location = useLocationContext()
    const [_playlistData, setPlaylistData] = useState<playlistData>({
        type: "none",
        items: [],
    })
    const [previewPlaylistItem, setPreviewPlaylistItem] = useState<{ item: playlistVideoItem | null, index: number }>({ item: null, index: -1 })

    // URLのクエリパラメータ。playlistにはbase64でエンコードされたプレイリストの情報が入っている。
    const playlistString = new URLSearchParams(location.search).get("playlist")

    // フォールバックのプレイリスト(現在の動画のみ)はレンダリング中に派生する。
    // プレイリストのクエリパラメータがなく、プレイリストが未カスタマイズの場合のみ設定する。
    const currentVideoId = videoInfo?.data?.response?.video?.id
    const [prevVideoId, setPrevVideoId] = useState<string>()
    if (videoInfo && currentVideoId && currentVideoId !== prevVideoId) {
        setPrevVideoId(currentVideoId)
        if (!playlistString && isUnsetOrTrivial(_playlistData)) {
            setPlaylistData(buildInitialPlaylist(videoInfo))
        }
    }

    // updatePlaylistStateから最新のstateを参照するためのref
    const latestRef = useRef({ playlistData: _playlistData, videoInfo })
    useEffect(() => {
        latestRef.current = { playlistData: _playlistData, videoInfo }
    })

    // プレイリストのクエリパラメータからマイリストもしくはシリーズ、検索のデータを取得してプレイリストに反映する
    const updatePlaylistState = useCallback((playlistString: string) => {
        const { playlistData: currentPlaylistData, videoInfo } = latestRef.current
        // カスタマイズ済みのプレイリストは上書きしない
        if (!isUnsetOrTrivial(currentPlaylistData)) return
        const playlistJson: playlistQueryData = decodePlaylistString(playlistString)

        async function getData() {
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
                // fetchしようとしているシリーズが、すでにフェッチ済みのシリーズと同一ならスキップする
                if (currentPlaylistData.id === playlistJson.context.seriesId) return
                const response = await queryClient.fetchQuery({
                    queryKey: ["series", playlistJson.context.seriesId],
                    queryFn: () => getSeriesInfo(playlistJson.context.seriesId),
                })
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
                const items = rotatePlaylistToStart(
                    playlistToSimplifiedPlaylist(response),
                    videoInfo?.data?.response.video.id,
                )
                setPlaylistData({
                    type: "search",
                    id: playlistString,
                    name: response.data.meta.title,
                    items,
                })
            }
        }
        getData()
    }, [queryClient])

    // URLのプレイリストパラメータの変化に応じてデータを取得する。
    // 遷移(history.push)と戻る/進む(popstate)はいずれもRouterProviderがlocationに反映する。
    // searchプレイリストの巡回にはvideoInfoが必要なので、到着するまで待つ。
    useEffect(() => {
        if (videoInfo && playlistString) updatePlaylistState(playlistString)
    }, [playlistString, videoInfo, updatePlaylistState])

    const controlFunctionsMemo = useMemo(() => ({
        setPlaylistData,
        setPreviewPlaylistItem,
    }), [])

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

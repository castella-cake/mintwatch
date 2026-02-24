import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useControlPlaylistContext } from "@/components/Global/Contexts/PlaylistProvider"
import { playlistVideoItem } from "../Playlist"
import { IconCheck, IconPlaylistAdd } from "@tabler/icons-react"

// WatchNextのVideoItemCardに表示する追加のアクションボタン
export function WatchNextVideoAction({ playlistObject }: { playlistObject: playlistVideoItem | undefined }) {
    const { setPlaylistData } = useControlPlaylistContext()
    const { showToast } = useSetMessageContext()
    const [added, setAdded] = useState(false)
    if (!playlistObject) return
    return (
        <>
            <button
                className="info-card-externalbutton"
                title="再生キューに追加"
                onClick={() => {
                    setAdded(true)
                    showToast({ title: "再生キューに追加しました", icon: <IconCheck /> })
                    setPlaylistData((playlistData) => {
                        const itemsAfter = [...playlistData.items, playlistObject]
                        return {
                            ...playlistData,
                            items: itemsAfter,
                            type: "custom",
                        }
                    })
                }}
            >
                { added ? <IconCheck /> : <IconPlaylistAdd /> }
            </button>
        </>
    )
}

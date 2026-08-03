import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useControlPlaylistContext } from "@/components/Global/Contexts/PlaylistProvider"
import { MWButton } from "@/components/Global/MWButton"
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
            <MWButton
                label="再生キューに追加"
                className="info-card-externalbutton"
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
            </MWButton>
        </>
    )
}

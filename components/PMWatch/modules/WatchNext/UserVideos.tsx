// import { useLang } from "../localizeHook";
import { VideoOwner } from "@/types/VideoData"
import { useUserVideoData } from "@/hooks/apiHooks/watch/userVideoData"
import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { WatchNextVideoAction } from "./WatchNextVideoAction"

function UserVideos({ videoOwnerData, isHorizontalCardLayout }: { videoOwnerData?: VideoOwner | null, isHorizontalCardLayout?: boolean }) {
    // const lang = useLang()
    const { showExtendedRecommend } = useStorageVar(["showExtendedRecommend"])
    const userVideoData = useUserVideoData(videoOwnerData ? videoOwnerData.id : undefined)

    return (
        userVideoData && userVideoData.data.items.map((item, index) => {
            return (
                <VideoItemCard
                    key={`userVideos-${item.essential.id}`}
                    video={item.essential}
                    markAsLazy={index >= 5}
                    showStats={showExtendedRecommend}
                    layoutType={isHorizontalCardLayout ? "vertical-simple" : "horizontal-simple"}
                    externalVideoActionChildren={(
                        <WatchNextVideoAction playlistObject={videoItemToPlaylistItem(item.essential)} />
                    )}
                />
            )
        })
    )
}

export default UserVideos

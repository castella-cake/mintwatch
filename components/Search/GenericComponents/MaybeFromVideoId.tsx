import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useVideosData } from "@/hooks/apiHooks/videosData"
import "./styles/MaybeFromVideoId.css"
import { IconArrowRight, IconDeviceTv } from "@tabler/icons-react"

export function MaybeFromVideoId({ keyword }: { keyword: string }) {
    const detectedVideoIds = detectVideoIdFromString(keyword)
    const { data, isLoading, isError } = useVideosData(detectedVideoIds || [])

    if (isLoading || isError || !data) return

    return (
        <div className="maybe-container">
            <div className="maybe-title">
                <IconDeviceTv />
                <IconArrowRight />
                <span>もしかして？</span>
            </div>
            <div className="maybe-items">
                {data.data.items.map(item => (
                    <VideoItemCard key={item.video.id} video={item.video} layoutType="horizontal-simple" showStats={true} />
                ))}
            </div>
        </div>
    )
}

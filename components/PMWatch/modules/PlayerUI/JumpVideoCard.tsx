import { VideoItemCard } from "@/components/Global/ItemCard/VideoItemCard"
import { useVideosData } from "@/hooks/apiHooks/videosData"

export function JumpVideoCard({ smId, message, onCancel }: { smId: string, message: string, onCancel: () => void }) {
    const { data, isLoading, isError } = useVideosData([smId])
    const video = data?.data.items.find(item => item.video.id === smId)?.video

    return (
        <div className="player-jump-card">
            <div className="player-jump-title">投稿者が設定した動画へ移動します</div>
            <div className="player-jump-message">{message || `${smId} へ移動します`}</div>
            {isLoading && <div className="player-jump-status">動画情報を読み込んでいます…</div>}
            {isError && <div className="player-jump-status">動画情報を取得できませんでした</div>}
            {!isLoading && !isError && !video && <div className="player-jump-status">動画が見つかりませんでした</div>}
            {video && <VideoItemCard video={video} layoutType="horizontal-simple" showStats={false} />}
            <button className="player-jump-cancel" type="button" onClick={onCancel}>キャンセル</button>
        </div>
    )
}

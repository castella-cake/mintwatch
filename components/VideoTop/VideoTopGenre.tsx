import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { useGenresQuery } from "@/hooks/apiHooks/global/genres"

export function VideoTopGenre({ genre }: { genre: string }) {
    const { genresData } = useGenresQuery()
    const recommendData = useRecommendData("video_top_genre_tag_recommend", genre)

    const thisGenre = genresData && genresData.data.genres.find(g => g.key === genre)

    return (
        <div className="videotop-feed">
            <h2 className="videotop-genre-title">
                <span className="videotop-genre-title-label">ジャンル</span>
                <strong>{thisGenre?.label}</strong>
            </h2>
            <div className="videotop-row videotop-recommend">
                <div className="videotop-row-title">おすすめ動画</div>
                <div className="videotop-row-items">
                    {
                        recommendData?.data?.items.map((item) => {
                            if (!isValidVideoItem(item.content)) return null
                            return (
                                <VideoItemCard key={item.id} video={item.content as VideoItem} layoutType="vertical-simple" />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

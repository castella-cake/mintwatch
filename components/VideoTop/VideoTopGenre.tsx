import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { VideoItemCard } from "../Global/ItemCard/VideoItemCard"
import { useGenresQuery } from "@/hooks/apiHooks/global/genres"
import { useV2SearchData } from "@/hooks/apiHooks/search/v2SearchData"

export function VideoTopGenre({ genre }: { genre: string }) {
    const { genresData } = useGenresQuery()
    const recommendData = useRecommendData("video_top_genre_tag_recommend", genre)

    const thisGenre = genresData && genresData.data.genres.find(g => g.key === genre)
    const genreLastCommentSearchData = useV2SearchData("keyword", thisGenre?.label ?? "", 8, "lastCommentTime", "desc", genre)
    const genreRegisteredAtSearchData = useV2SearchData("keyword", thisGenre?.label ?? "", 8, "registeredAt", "desc", genre)

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
            <div className="videotop-row videotop-recent-comments">
                <div className="videotop-row-title">新着コメント</div>
                <div className="videotop-row-items">
                    {
                        genreLastCommentSearchData?.data.items.map((item) => {
                            if (!isValidVideoItem(item)) return null
                            return (
                                <VideoItemCard key={item.id} video={item} layoutType="vertical-simple" />
                            )
                        })
                    }
                </div>
            </div>
            <div className="videotop-row videotop-new-posts">
                <div className="videotop-row-title">新着動画</div>
                <div className="videotop-row-items">
                    {
                        genreRegisteredAtSearchData?.data.items.map((item) => {
                            if (!isValidVideoItem(item)) return null
                            return (
                                <VideoItemCard key={item.id} video={item} layoutType="vertical-simple" />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

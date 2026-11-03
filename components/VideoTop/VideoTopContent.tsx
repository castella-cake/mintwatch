import { useGenresQuery } from "@/hooks/apiHooks/global/genres"
import { HistoryAnchor } from "../Router/HistoryAnchor"

import "./styles/VideoTopContent.css"
import "./styles/VideoTopFeed.css"
import { RecentActivity } from "./RecentActivity/RecentActivity"
import { useLocationContext } from "../Router/RouterContext"
import { Match } from "../Router/RouterUI"
import { VideoTopIndex } from "./VideoTopIndex"
import { VideoTopGenre } from "./VideoTopGenre"

export function VideoTopContent() {
    const location = useLocationContext()

    const { genresData } = useGenresQuery()

    const splittedPathname = location.pathname.split("/")
    const genreKey = (splittedPathname.length === 4 && splittedPathname[3]) || null

    return (
        <div className="videotop-content">
            {genresData?.data?.genres && genresData.data.genres.length > 0 && (
                <div className="videotop-genres">
                    <HistoryAnchor
                        className="videotop-genre"
                        href="/video_top"
                        data-is-active={location.pathname === `/video_top`}
                    >
                        TOP
                    </HistoryAnchor>
                    {genresData.data.genres.map(genre => (
                        <HistoryAnchor
                            key={genre.key}
                            className="videotop-genre"
                            href={`/video_top/genre/${encodeURIComponent(genre.key)}`}
                            data-is-active={location.pathname === `/video_top/genre/${encodeURIComponent(genre.key)}`}
                        >
                            {genre.label}
                        </HistoryAnchor>
                    ))}
                </div>
            )}
            <div className="videotop-left videotop-follow">
                <div className="videotop-left-title">What&apos;s New</div>
                <RecentActivity />
            </div>
            <Match targetPathname="/video_top!">
                <VideoTopIndex />
            </Match>
            <Match targetPathname="/video_top/genre/:">
                {
                    genresData?.data.genres && genreKey && (
                        genresData?.data.genres.map(g => g.key).includes(genreKey)
                            ? <VideoTopGenre genre={genreKey} />
                            : (
                                    <div className="videotop-invalidgenre">
                                        不明なジャンルキーです
                                    </div>
                                )
                    )
                }
            </Match>
        </div>
    )
}

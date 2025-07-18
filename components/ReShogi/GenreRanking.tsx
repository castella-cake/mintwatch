import { GenreRankingDataRootObject } from "@/types/ranking/genreData";
import { Card } from "@/components/Global/InfoCard";
import { readableInt, secondsToTime } from "@/utils/readableValue";
import { IconClock, IconCrown, IconFolderFilled, IconMessageFilled, IconPlayerPlayFilled, IconTag } from "@tabler/icons-react";
import { useLocationContext } from "../Router/RouterContext";
import { HistoryAnchor } from "../Router/HistoryAnchor";
import { useQuery } from "@tanstack/react-query";

function PageSelector({ page }: {page: GenreRankingDataRootObject["data"]["response"]["page"]}) {
    const location = useLocationContext()
    return <div className="shogi-genre-stats-page-selector">
        <div className="shogi-genre-stats-pagination">
            ページ {page.pagination.page} - {page.pagination.totalCount} 件中 {page.pagination.pageSize} 件
        </div>
        {[...Array(page.pagination.totalCount / page.pagination.pageSize)].map((_, index) => {
            const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search);
            pathUrl.searchParams.set("page", (index + 1).toString())
            return <HistoryAnchor key={index} className="shogi-genre-page-button" data-is-active={index === (page.pagination.page - 1)} href={pathUrl.toString()}>
                {index + 1}
            </HistoryAnchor>
        })}
    </div>
}

function TermSelector({ page }: {page: GenreRankingDataRootObject["data"]["response"]["page"]}) {
    const location = useLocationContext()
    return <div className="shogi-genre-term-selector">
        <div className="shogi-genre-term-title">
            集計期間を選択
        </div>
        {page.availableTerms.map(term => {
            const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search);
            pathUrl.searchParams.set("term", term.value)
            return <HistoryAnchor key={term.value} className="shogi-genre-term-button" href={pathUrl.toString()} data-is-active={page.currentTerm === term.value}>
                {term.label}
            </HistoryAnchor>
        })}
    </div>
}

export default function GenreRankingContent() {
    const location = useLocationContext()

    const thisPath = location.pathname.replace(/\?.*/, "").replace("/ranking/genre", "")

    const pathUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search);
    const tagParam = pathUrl.searchParams.get("tag");

    const pageParam = pathUrl.searchParams.get("page") ?? "1";

    const termParam = pathUrl.searchParams.get("term") ?? "24h";

    const featuredKeyPathArray = location.pathname.replace(/\?.*/, "").replace("/ranking/genre/", "").split("/")

    const { data: genreRankingData } = useQuery({
        queryKey: ['ranking', 'custom', pageParam, termParam, featuredKeyPathArray[0], tagParam],
        queryFn: () => {
            if (thisPath === "" || thisPath === "/") {
                return getGenreRanking(pageParam, termParam);
            } else if (tagParam) {
                return getGenreRanking(pageParam, termParam, featuredKeyPathArray[0], tagParam);
            } else {
                return getGenreRanking(pageParam, termParam, featuredKeyPathArray[0]);
            }
        },
    })

    if (!genreRankingData) return <div className="shogi-loading">Loading...</div>

    const teibanRanking = genreRankingData.data.response.$getTeibanRanking
    const teibanRankingFeaturedKeys = genreRankingData.data.response.$getTeibanRankingFeaturedKeys
    const teibanRankingFeaturedKeyAndTrendTags = genreRankingData.data.response.$getTeibanRankingFeaturedKeyAndTrendTags
    const page = genreRankingData.data.response.page

    return (
        <div className="shogi-genre-ranking">
            <title>{genreRankingData && genreRankingData.data.metadata.title}</title>
            <div className="shogi-genre-featured-container">
                <div className="shogi-genre-teiban-selector-container">
                    {teibanRankingFeaturedKeys.data.items.map(keys => {
                        return <HistoryAnchor
                            href={`/ranking/genre/${keys.featuredKey}`}
                            className="shogi-genre-teiban-selector"
                            key={keys.featuredKey}
                            data-is-active={location.pathname === `/ranking/genre/${keys.featuredKey}` || ((location.pathname === "/ranking/genre/" || location.pathname === "/ranking/genre") && keys.isTopLevel)}
                        >
                            {keys.label}
                        </HistoryAnchor>
                    })}
                </div>
            </div>
            <div className="shogi-genre-trendtags">
                <h3><IconTag />トレンドのタグランキングを見る</h3>
                {teibanRankingFeaturedKeyAndTrendTags.data.trendTags.length > 0 ? teibanRankingFeaturedKeyAndTrendTags.data.trendTags.map(tag => {
                    return <HistoryAnchor className="shogi-genre-trend-tag" key={tag} href={`/ranking/genre/${teibanRanking.data.featuredKey}?tag=${encodeURIComponent(tag)}`}>
                        {tag}
                    </HistoryAnchor>
                }) : <div className="shogi-genre-no-trend-tags">
                    ジャンルを「総合」以外に切り替えると、<br/>
                    ここにトレンドのタグが表示されます。
                </div>}
            </div>
            <div className="shogi-genre-stats">
                <div className="shogi-genre-this-title">
                    <span className="shogi-genre-this-title-subtitle"><IconCrown /> ジャンル</span><br/>
                    <span className="shogi-genre-genretitle">
                        {teibanRanking.data.label}
                    </span>
                    {teibanRanking.data.tag && <>
                        <br/>
                        <span className="shogi-genre-tag">
                            タグ {teibanRanking.data.tag} のランキング
                        </span>
                    </>}
                </div>
                <PageSelector page={page}/>
                <TermSelector page={page}/>
            </div>
            <div className="shogi-genre-items">
                {teibanRanking.data.items.map((video, index) => {
                    return <div className="shogi-genre-item" key={`${index}-${video.id}`} data-index={index + 1 + ((page.pagination.page - 1) * page.pagination.pageSize)}>
                        <Card
                            href={`https://www.nicovideo.jp/watch/${encodeURIComponent(video.id)}`}
                            additionalClassName="shogi-video"
                            title={video.title}
                            subTitle={<>
                                <div className="shogi-short-desc">{video.shortDescription}</div>
                                <div className="shogi-video-counts">
                                    <span className="shogi-video-count">
                                        <IconPlayerPlayFilled />
                                        {readableInt(video.count.view, 1)}
                                    </span>
                                    <span className="shogi-video-count">
                                        <IconMessageFilled />
                                        {readableInt(video.count.comment, 1)}
                                    </span>
                                    <span className="shogi-video-count">
                                        <IconFolderFilled />
                                        {readableInt(video.count.mylist, 1)}
                                    </span>
                                    <span className="shogi-video-count">
                                        <IconClock />
                                        {relativeTimeFrom(new Date(video.registeredAt))}
                                    </span>
                                </div>
                                <a href={video.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${video.owner.id}` : `https://www.nicovideo.jp/user/${video.owner.id}`} className="shogi-video-owner">
                                    <img src={video.owner.iconUrl} className="shogi-video-owner-icon" alt={`${video.owner.name} のアイコン`} />
                                    <span className="shogi-video-owner-name">{video.owner.name}</span>
                                </a>

                            </>}
                            thumbnailUrl={video.thumbnail.listingUrl}
                            thumbText={`${secondsToTime(video.duration)}`}
                        >
                            {video.title}
                        </Card>
                    </div>
                })}
            </div>
            <PageSelector page={page}/>
        </div>
    );
}
import { SeriesVideoCard } from "./InfoCards";
import { IconListNumbers } from "@tabler/icons-react";
import { useVideoInfoContext } from "../Contexts/VideoDataProvider";

function SeriesInfo() {
    const { videoInfo } = useVideoInfoContext();
    if (!videoInfo) return <></>;

    const seriesData = videoInfo.data.response.series;
    const playlist = btoa(
        `{"type":"series","context":{"seriesId":${(seriesData && seriesData.id) || 0}}}`,
    );
    return (
        <div className="seriesinfo-container" id="pmw-seriesinfo">
            {seriesData ? (
                <div className="seriesinfo-content">
                    <div className="seriesinfo-thumbnail-wrapper">
                        <img
                            src={seriesData.thumbnailUrl}
                            alt={`${seriesData.title} のサムネイル`}
                            className="seriesinfo-thumbnail"
                        />
                    </div>
                    <div className="seriesinfo-title">
                        <span className="seriesinfo-seriestext">
                            <IconListNumbers /> シリーズ
                        </span>
                        <br />
                        <a
                            href={`https://www.nicovideo.jp/series/${encodeURIComponent(seriesData.id)}`}
                        >
                            {seriesData.title}
                        </a>
                    </div>
                    <div className="seriesinfo-first">
                        {seriesData.video.first ? (
                            <SeriesVideoCard
                                seriesVideoItem={seriesData.video.first}
                                playlistString={playlist}
                                transitionId={seriesData.id}
                                type="first"
                            />
                        ) : (
                            <div className="seriesinfo-no-video">
                                最初の動画はありません
                            </div>
                        )}
                    </div>
                    <div className="seriesinfo-episodes">
                        {seriesData.video.prev ? (
                            <SeriesVideoCard
                                seriesVideoItem={seriesData.video.prev}
                                playlistString={playlist}
                                transitionId={seriesData.id}
                            />
                        ) : (
                            <div className="seriesinfo-no-video">
                                前の動画はありません
                            </div>
                        )}
                        {seriesData.video.next ? (
                            <SeriesVideoCard
                                seriesVideoItem={seriesData.video.next}
                                playlistString={playlist}
                                transitionId={seriesData.id}
                                type={"next"}
                            />
                        ) : (
                            <div className="seriesinfo-no-video">
                                次の動画はありません
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="seriesinfo-noseries">
                    <span className="seriesinfo-noseries-text">
                        <span className="seriesinfo-seriestext">
                            <IconListNumbers /> シリーズ
                        </span>
                        <br />
                        この動画に登録されているシリーズはありません
                    </span>
                </div>
            )}
        </div>
    );
}

export default SeriesInfo;

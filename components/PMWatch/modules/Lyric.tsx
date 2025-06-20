import { useSmIdContext } from "@/components/Global/Contexts/WatchDataContext";
import { useLyricData } from "@/hooks/apiHooks/watch/lyricData";

import "../styleModules/Lyric.styl"
import { useVideoInfoContext, useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider";
import { IconTransitionBottom } from "@tabler/icons-react";

type lyricKeyRef = { [key: number]: HTMLDivElement | null }

const artistRegex = /(.*)\s?[\/／]\s?(.*)/
const removeZeroWidthSpacesRegex = /[\u200B-\u200D\uFEFF]/g

function trimWithZeroWidthSpaces(str: string): string {
    return str.replace(removeZeroWidthSpacesRegex, "").trim();
}

export default function Lyric() {
    const { smId } = useSmIdContext()
    const { videoInfo } = useVideoInfoContext()
    const videoRef = useVideoRefContext()

    const [autoScroll, setAutoScroll] = useState(true);
    const lyricRef = useRef<lyricKeyRef>({});
    const lyricsContentRef = useRef<HTMLDivElement>(null)
    const [currentLyricKey, setCurrentLyricKey] = useState(0);


    const { lyricData, error, isLoading } = useLyricData(smId)

    const updateScrollPosition = useCallback((e: Event) => {
        if (!lyricData || !lyricData.data.hasTimeInformation) return;
        if (!(e.target instanceof HTMLVideoElement)) return;
        const currentTime = e.target.currentTime
        let nearestLyricTimeKey: keyof lyricKeyRef = Object.keys(lyricRef.current)
            .map(k => Number(k))
            .filter(k => k <= currentTime * 1000) // 未来のキーを対象にしない
            .reduce((prev, current) => {
                return Math.abs(current - currentTime * 1000) < Math.abs(prev - currentTime * 1000) ? current : prev;
            }, Infinity);
        if (nearestLyricTimeKey === Infinity) nearestLyricTimeKey = 0
        if (currentLyricKey !== nearestLyricTimeKey) {
            setCurrentLyricKey(nearestLyricTimeKey)
            if (autoScroll && lyricRef.current[nearestLyricTimeKey] && lyricsContentRef.current) {
                lyricsContentRef.current.scrollTop = lyricRef.current[nearestLyricTimeKey]!.offsetTop - lyricsContentRef.current.offsetTop - (lyricsContentRef.current.clientHeight / 2);
            }
        }
    }, [lyricRef.current, lyricData, autoScroll, currentLyricKey])

    useEffect(() => {
        console.log("lyricRef updated: ", lyricRef.current)
        if (!videoRef.current) return;
        videoRef.current.addEventListener("timeupdate", updateScrollPosition);
        return () =>
            videoRef.current?.removeEventListener(
                "timeupdate",
                updateScrollPosition,
            );
    }, [lyricRef.current, lyricData, autoScroll, currentLyricKey])

    if (error) return <div className="lyrics-container">
        <span style={{ opacity: 0.5 }}>
            この動画には歌詞が登録されていません
        </span>
    </div>

    if (isLoading || !lyricData || !videoInfo) return <div className="lyrics-container">
        Loading...
    </div>

    if (!videoInfo.data.response.video) return

    const videoTitle = videoInfo.data.response.video.title
    const ownerNickname = videoInfo.data.response.owner && videoInfo.data.response.owner.nickname
    const titleRegexResult = artistRegex.exec(videoTitle)
    const artistString = titleRegexResult && titleRegexResult[2]
    // ゼロ幅スペースが仕込まれていても対応できるようにtrim
    const isArtistNameIncludeOwnerNickName = artistString && ownerNickname && trimWithZeroWidthSpaces(artistString).includes(trimWithZeroWidthSpaces(ownerNickname))

    const greatestAvailableQuality = videoInfo.data.response.media.domand && returnGreatestQuality(videoInfo.data.response.media.domand.audios)
    const audioQualityLabel = greatestAvailableQuality ? `${Math.floor(greatestAvailableQuality.bitRate / 1000)}kbps / ${greatestAvailableQuality.samplingRate}Hz` : "音声クオリティ不明"

    return <div className="lyrics-container">
        <div className="lyrics-title-container global-flex stacker-title">
            <div className="global-flex1 global-bold">
                この動画の歌詞
            </div>
            <button
                className="lyrics-toggleautoscroll"
                data-isenabled={autoScroll}
                onClick={() => {
                    if (!lyricData.data.hasTimeInformation) return
                    setAutoScroll((state) => {
                        return !state;
                    });
                }}
                aria-disabled={!lyricData.data.hasTimeInformation}
                title={!lyricData.data.hasTimeInformation ? "この歌詞データにはタイミング情報がありません" : (autoScroll ? "自動スクロールを無効化" : "自動スクロールを有効化")}
            >
                <IconTransitionBottom/>
            </button>
        </div>
        <div className="lyrics-content" ref={lyricsContentRef} data-is-time-information={lyricData.data.hasTimeInformation}>
            <div className="lyrics-header">
                <div className="lyrics-video-title">{titleRegexResult ? titleRegexResult[1] : videoTitle}</div>
                {titleRegexResult && <div className="lyrics-video-artist">{isArtistNameIncludeOwnerNickName ? "" : `${ownerNickname} `}{artistString}</div>}
                <div className="lyrics-video-quality">{audioQualityLabel}</div>
            </div>
            <div className="lyrics-list">
                {lyricData.data.lyrics.map((lyricRow, i) => <div key={`${lyricData.data.videoId}-${i}`} className="lyric-row" ref={(e) => {
                    if (lyricRow.startMs) lyricRef.current[lyricRow.startMs] = e;
                }} data-lyric-state={currentLyricKey === lyricRow.startMs ? 1 : (lyricRow.startMs !== null && currentLyricKey > lyricRow.startMs ? 2 : 0)}>
                    {lyricRow.lines.join("\n")}
                </div>)}
            </div>
        </div>
    </div>
}   
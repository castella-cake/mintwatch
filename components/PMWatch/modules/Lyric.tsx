import { useSmIdContext } from "@/components/Global/Contexts/WatchDataContext";
import { useLyricData } from "@/hooks/apiHooks/watch/lyricData";

import "../styleModules/Lyric.styl"
import { useVideoInfoContext, useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider";
import { IconTransitionBottom } from "@tabler/icons-react";

type lyricKeyRef = { [key: number]: HTMLDivElement | null }

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
        const nearestLyricTimeKey: keyof lyricKeyRef = Object.keys(lyricRef.current)
            .map(k => Number(k))
            .filter(k => k <= currentTime * 1000) // 未来のキーを対象にしない
            .reduce((prev, current) => {
                return Math.abs(current - currentTime * 1000) < Math.abs(prev - currentTime * 1000) ? current : prev;
            }, Infinity);
        if (currentLyricKey !== nearestLyricTimeKey) {
            setCurrentLyricKey(nearestLyricTimeKey)
            if (autoScroll && lyricRef.current[nearestLyricTimeKey] && lyricsContentRef.current) {
                lyricsContentRef.current.scrollTop = lyricRef.current[nearestLyricTimeKey].offsetTop - lyricsContentRef.current.offsetTop;
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

    return <div className="lyrics-container">
        <div className="lyrics-title-container global-flex stacker-title">
            <div className="global-flex1 global-bold">
                この動画の歌詞
            </div>
            <button
                className="lyrics-toggleautoscroll"
                data-isenabled={autoScroll}
                onClick={() => {
                    setAutoScroll((state) => {
                        return !state;
                    });
                }}
                title={autoScroll ? "自動スクロールを無効化" : "自動スクロールを有効化"}
            >
                <IconTransitionBottom/>
            </button>
        </div>
        <div className="lyrics-content" ref={lyricsContentRef} data-is-time-information={lyricData.data.hasTimeInformation}>
            {lyricData.data.lyrics.map((lyricRow, i) => <div key={`${lyricData.data.videoId}-${i}`} className="lyric-row" ref={(e) => {
                if (lyricRow.startMs) lyricRef.current[lyricRow.startMs] = e;
            }} data-is-current-lyric={currentLyricKey === lyricRow.startMs}>
                {lyricRow.lines.join("\n")}
            </div>)}
        </div>
    </div>
}   
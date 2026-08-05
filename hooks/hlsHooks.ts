import Hls from "hls.js"
import type { ErrorData } from "hls.js"
import { RefObject } from "react"

export function useHls(videoRef: RefObject<HTMLVideoElement | null>, hlsResponse: any, isEnabled = true, preferredLevel = -1) {
    const isSupportedBrowser = useMemo(() => Hls.isSupported(), [])
    const hlsRef = useRef<Hls>(null!)
    const preferredLevelRef = useRef(preferredLevel)
    preferredLevelRef.current = preferredLevel
    const [error, setError] = useState<ErrorData | null>(null)
    const [isBuffering, setIsBuffering] = useState(false)
    useEffect(() => {
        if (!hlsResponse || !videoRef.current || !isEnabled) {
            if (videoRef.current) videoRef.current.src = ""
            setError(null)
            setIsBuffering(false)
            return
        }
        setError(null)
        setIsBuffering(false)
        // hls.jsがサポートするならhls.jsで再生し、そうでない(Safariなど)ならネイティブ再生する
        if (isSupportedBrowser) {
            const hls = new Hls({ debug: false, xhrSetup: function (xhr) {
                // xhrでクッキーを含める
                xhr.withCredentials = true
            }, fetchSetup: function (context, initParams) {
                // クロスオリジンであってもクッキーを含める
                initParams.credentials = "include"
                return new Request(context.url, initParams)
            }, enableCEA708Captions: false })
            // videoのrefにアタッチ
            hls.attachMedia(videoRef.current)
            // 読み込み
            hls.startLevel = preferredLevelRef.current
            hls.loadSource(hlsResponse.data.contentUrl)
            let lastMediaRecoveryAttempt = 0
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    // MEDIA_ERRORはrecoverMediaError()で回復を試みる(5秒以内の連続試行はしない)
                    if (data.type === Hls.ErrorTypes.MEDIA_ERROR && Date.now() - lastMediaRecoveryAttempt > 5000) {
                        lastMediaRecoveryAttempt = Date.now()
                        hls.recoverMediaError()
                        return
                    }
                    setError(data)
                    setIsBuffering(true)
                    return
                }
            })
            // 再生が進んだらバッファリング表示を解除する
            hls.on(Hls.Events.FRAG_BUFFERED, () => setIsBuffering(false))
            hls.on(Hls.Events.BUFFER_APPENDED, () => setIsBuffering(false))
            hls.on(Hls.Events.LEVEL_LOADED, () => setIsBuffering(false))
            hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
                setIsBuffering(false)
                // console.log(data.levels)
                if (preferredLevelRef.current !== -1 && hls.currentLevel !== preferredLevelRef.current) hls.currentLevel = Math.min(preferredLevelRef.current, (data.levels.length - 1))
            })
            hlsRef.current = hls
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = hlsResponse.data.contentUrl
        }
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
            if (videoRef.current) {
                videoRef.current.src = ""
                videoRef.current.currentTime = 0
            }
        }
    }, [hlsRef, hlsResponse, isSupportedBrowser, videoRef, isEnabled])

    // ネイティブ再生(Safariなど)でもバッファリングを検出する
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const onWaiting = () => setIsBuffering(true)
        const onPlaying = () => setIsBuffering(false)
        video.addEventListener("waiting", onWaiting)
        video.addEventListener("playing", onPlaying)
        return () => {
            video.removeEventListener("waiting", onWaiting)
            video.removeEventListener("playing", onPlaying)
        }
    }, [videoRef, hlsResponse])

    useEffect(() => {
        const hls = hlsRef.current
        if (!hls || preferredLevel === -1 || !hls.levels.length) return
        const target = Math.min(preferredLevel, hls.levels.length - 1)
        if (hls.currentLevel !== target) hls.currentLevel = target
    }, [preferredLevel, hlsRef])

    return { hlsRef, error, isBuffering }
}

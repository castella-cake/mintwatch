import Hls from "hls.js"
import { RefObject } from "react"

export function useHls(videoRef: RefObject<HTMLVideoElement | null>, hlsResponse: any, isEnabled = true, preferredLevel = -1) {
    const isSupportedBrowser = useMemo(() => Hls.isSupported(), [])
    const hlsRef = useRef<Hls>(null!)
    useEffect(() => {
        if (!hlsResponse || !videoRef.current || !isEnabled) {
            if (videoRef.current) videoRef.current.src = ""
            return
        }
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
            hls.startLevel = preferredLevel
            hls.loadSource(hlsResponse.data.contentUrl)
            hls.on(Hls.Events.ERROR, (err) => {
                console.log(err)
            })
            hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
                // console.log(data.levels)
                if (preferredLevel !== -1 && hls.currentLevel !== preferredLevel) hls.currentLevel = Math.min(preferredLevel, (data.levels.length - 1))
            })
            hlsRef.current = hls
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = hlsResponse.data.contentUrl
        }
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
            if (videoRef.current) videoRef.current.src = ""
        }
    }, [hlsRef, hlsResponse, isSupportedBrowser, preferredLevel, videoRef, isEnabled])

    return hlsRef
}

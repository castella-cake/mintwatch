import "../styles/GuestIframe.css"

export function GuestIframe({ src }: { src: string }) {
    const origin = new URL(src).origin
    const [iframeHeight, setIframeHeight] = useState(0)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    useEffect(() => {
        let settled = false
        const controller = new AbortController()
        let interval: NodeJS.Timeout | null = setInterval(() => {
            iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
                method: "$/ping",
                params: {
                    settled: settled,
                },
                __uuid: "7f260704-fe5a-4c66-8361-121a0ea04a30",
            }), origin)
            // console.log("GuestIframe: ping sent", settled)
            if (settled && interval) {
                clearInterval(interval)
                interval = null
            }
        }, 500)
        const timeout = setTimeout(() => {
            if (interval) {
                console.error("GuestIframe: timeout, no response from iframe")
                clearInterval(interval)
                interval = null
            }
        }, 10000)
        window.addEventListener("message", (e) => {
            if (e.origin !== origin) return
            // console.log(e)
            if (origin === "https://creator-support.nicovideo.jp") {
                const data = JSON.parse(e.data) as { height?: number }
                if (typeof data.height === "number") {
                    settled = true
                    setIframeHeight(data.height)
                    if (interval) {
                        clearInterval(interval)
                        interval = null
                    }
                    return
                }
            }
            // {"method":"page/heightChanged","params":{"height":4316.390625},"__uuid":"7f260704-fe5a-4c66-8361-121a0ea04a30"}
            const data = JSON.parse(e.data) as { method: string, params: { height?: number, settled?: boolean }, __uuid: string }
            if (data.method === "page/heightChanged" && data.params.height) {
                settled = true
                setIframeHeight(data.params.height)
                if (interval) {
                    clearInterval(interval)
                    interval = null
                }
            } else if (data.method === "$/ping") {
                settled = true
                // console.log("GuestIframe: settled")
            }
        }, { signal: controller.signal })
        return () => {
            controller.abort()
            if (interval) {
                clearInterval(interval)
                interval = null
            }
            clearTimeout(timeout)
        }
    }, [origin])
    return (
        <div className="user-category-content">
            <div className="guest-iframe-wrapper">
                <iframe
                    src={src}
                    className="guest-iframe"
                    ref={iframeRef}
                    style={{
                        height: iframeHeight,
                    }}
                >
                </iframe>
            </div>
        </div>
    )
}

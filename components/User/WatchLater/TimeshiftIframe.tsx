import "../styles/TimeshiftIframe.css"

export function TimeshiftIframe() {
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
            }), "https://live.nicovideo.jp")
            // console.log("TimeshiftIframe: ping sent", settled)
            if (settled && interval) {
                clearInterval(interval)
                interval = null
            }
        }, 500)
        const timeout = setTimeout(() => {
            if (interval) {
                console.error("TimeshiftIframe: timeout, no response from iframe")
                clearInterval(interval)
                interval = null
            }
        }, 10000)
        window.addEventListener("message", (e) => {
            if (e.origin !== "https://live.nicovideo.jp") return
            // console.log(e)
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
                // console.log("TimeshiftIframe: settled")
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
    }, [])
    return (
        <div className="user-category-content">
            <iframe
                src="https://live.nicovideo.jp/embed/timeshift-reservations"
                className="timeshift-iframe"
                ref={iframeRef}
                style={{
                    height: iframeHeight,
                }}
            >
            </iframe>
        </div>
    )
}

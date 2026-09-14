import { useQuery } from "@tanstack/react-query"
import NiconiComments from "@xpadev-net/niconicomments"

export function MintWatchThanks() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const niconicommentsRef = useRef<NiconiComments | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const vposRef = useRef<number>(0)
    const animationFrameIdRef = useRef<number>(null!)
    const { data: credits } = useQuery({
        queryKey: ["mwInternal", "credits"],
        queryFn: async () => {
            const response = await fetch(browser.runtime.getURL("/credits.json"))
            return response.json()
        },
    })

    const draw = useCallback(() => {
        if (!niconicommentsRef.current) return
        niconicommentsRef.current.drawCanvas(vposRef.current)
        if (vposRef.current > 15000) return
        animationFrameIdRef.current = requestAnimationFrame(draw)
    }, [])
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        intervalRef.current = null
        async function showCredits() {
            if (!credits) return

            if (canvasRef.current === null) return

            // const json = typeof data === "string" ? JSON.parse(data) : data
            niconicommentsRef.current = new NiconiComments(canvasRef.current, credits, {
                format: "owner",
                enableLegacyPiP: true,
                config: {
                    canvasWidth: 1366,
                    canvasHeight: 768,
                    commentScale: 1366 / 683,
                    commentDrawRange: 1088,
                    commentDrawPadding: 139,
                },
            }) //

            vposRef.current = 0
            intervalRef.current = setInterval(() => {
                vposRef.current += 1.6 / 1
            }, 16)
            draw()
        }
        showCredits()

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
            niconicommentsRef.current?.destroy()
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current)
            }
        }
    }, [credits, draw])

    return (
        <div className="mintwatch-thanks">
            <canvas ref={canvasRef} className="mintwatch-thanks-renderer" width={1366} height={768} style={{ width: "min(80vw, 910px)", aspectRatio: "16 / 9" }} />
        </div>
    )
}

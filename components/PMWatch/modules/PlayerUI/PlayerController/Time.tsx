import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"

export function Time() {
    const videoRef = useVideoRefContext()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller
        const updateCurrentTime = () => {
            if (videoRef.current!.currentTime !== currentTime) {
                setCurrentTime(videoRef.current!.currentTime)
            }
        }
        const updateDuration = () => {
            if (videoRef.current!.duration !== duration) setDuration(videoRef.current!.duration)
        }
        videoRef.current?.addEventListener("timeupdate", updateCurrentTime, { signal })
        videoRef.current?.addEventListener("durationchange", updateDuration, { signal })

        return () => controller.abort()
    }, [])
    return (
        <div key="control-time" className="playercontroller-time">
            {secondsToTime(currentTime)}
            /
            {secondsToTime(duration)}
        </div>
    )
}

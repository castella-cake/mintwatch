import { IconVolume, IconVolume3 } from "@tabler/icons-react"
import { PlayerControllerButton } from "./Button"
import { useVideoRefContext } from "@/components/Global/Contexts/VideoDataProvider"
import { startTransition } from "react"

export function VolumeController() {
    const videoRef = useVideoRefContext()
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const handleMuteToggle = useCallback(() => {
        if (!videoRef.current) return
        setIsMuted(!isMuted)
        videoRef.current.muted = !isMuted
        startTransition(() => {
            storage.setItem("local:isMuted", !isMuted)
        })
    }, [setIsMuted, isMuted])

    const [videoVolume, setVideoVolume] = useState<number>(0)
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return
        setVideoVolume(Math.floor(e.currentTarget.valueAsNumber))
        videoRef.current.volume = Math.floor(e.currentTarget.valueAsNumber) * 0.01
        startTransition(() => {
            storage.setItem("local:videoVolume", Math.floor(e.currentTarget.valueAsNumber))
        })
    }, [setVideoVolume])

    useEffect(() => {
        getStorageItemsWithObject(["local:videoVolume", "local:isMuted"]).then((object) => {
            if (!videoRef.current) return
            setVideoVolume(object["local:videoVolume"] ?? 50)
            videoRef.current.volume = (object["local:videoVolume"] ?? 50) * 0.01
            setIsMuted(object["local:isMuted"])
            videoRef.current.muted = object["local:isMuted"] ?? false
        })

        const updateVolumeState = () => {
            if (!videoRef.current) return
            if (videoRef.current.volume !== videoVolume / 100) {
                setVideoVolume(videoRef.current.volume * 100)
                storage.setItem("local:volume", videoRef.current.volume * 100)
            }
            if (videoRef.current.muted !== isMuted) {
                setIsMuted(videoRef.current.muted)
                storage.setItem("local:isMuted", videoRef.current.muted)
            }
        }
        videoRef.current?.addEventListener("volumechange", updateVolumeState)
    }, [])
    return (
        <>
            <MuteToggleButton isMuted={isMuted} handleMuteToggle={handleMuteToggle} videoVolume={videoVolume} />
            <VolumeSlider videoVolume={videoVolume} handleVolumeChange={handleVolumeChange} isMuted={isMuted} />
        </>
    )
}

function VolumeSlider({ videoVolume, handleVolumeChange: onVolumeChange, isMuted }: { videoVolume: number, handleVolumeChange: React.ChangeEventHandler<HTMLInputElement>, isMuted: boolean }) {
    return (
        <span key="control-volume" className="playercontroller-volume-container" style={{ ["--width" as string]: `${videoVolume}%` }}>
            <input type="range" className="playercontroller-volume" min="0" max="100" value={videoVolume} disabled={isMuted} aria-label={`音量 ${Math.floor(videoVolume)}%`} onChange={onVolumeChange} />
            <span className="playercontroller-volume-tooltip">
                {Math.floor(videoVolume)}
                %
            </span>
        </span>
    )
}

function MuteToggleButton({ isMuted, handleMuteToggle: onMuteToggle, videoVolume }: { isMuted: boolean, handleMuteToggle: (e: React.MouseEvent<HTMLButtonElement>) => void, videoVolume: number }) {
    return <PlayerControllerButton key="control-togglemute" className="playercontroller-togglemute" onClick={onMuteToggle} title={isMuted ? "ミュート解除" : "ミュート"}>{(isMuted || videoVolume <= 0) ? <IconVolume3 /> : <IconVolume />}</PlayerControllerButton>
}

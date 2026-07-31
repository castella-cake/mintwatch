import { usePickupSupportersData } from "@/hooks/apiHooks/watch/getPickupSupportersData"
import APIError from "@/utils/classes/APIError"
import { perceptualToAmplitude } from "@discordapp/perceptual"
import { IconVolume, IconVolume3 } from "@tabler/icons-react"

export function KokenScreen({ smId }: { smId: string }) {
    const syncStorage = useStorageVar(["muteKokenVoice"] as const, "sync")
    const localStorage = useStorageVar(["isMuted", "volume", "isLoop", "enableShufflePlay", "rewindTime", "enableBigView"] as const, "local")

    const { pickupSupportersData: supportersInfo, error } = usePickupSupportersData(smId)

    const audioElemRef = useRef<HTMLAudioElement>(null)

    const isKokenMuted = syncStorage.muteKokenVoice ?? getDefault("muteKokenVoice")

    useEffect(() => {
        // console.log("vol set:", audioElemRef.current)
        if (!audioElemRef.current) return

        audioElemRef.current.volume = perceptualToAmplitude((localStorage.volume ?? 50) * 0.01, 1, 40)
        audioElemRef.current.muted = localStorage.isMuted ?? false
    }, [localStorage.volume, localStorage.isMuted, audioElemRef.current])

    const handleMuteToggle = useCallback(() => {
        storage.setItem("sync:muteKokenVoice", !isKokenMuted)
    }, [isKokenMuted])

    const onSupportLinkClicked = useCallback(() => {
        window.open(
            `https://nicoad.nicovideo.jp/video/publish/${smId}`,
            "_blank",
            "width=500,height=700,popup=yes",
        )
    }, [smId])

    const isNotFoundError = error instanceof APIError && error.response?.meta?.status === 404

    /* eslint no-irregular-whitespace: 0 */
    return (
        <div className="endcard-supporters">
            <div className="endcard-supporters-main">
                {isNotFoundError
                    ? (
                            <>
                                <span className="endcard-supporters-notfound">
                                    有効なニコニ広告はありません。
                                </span>
                            </>
                        )
                    : (
                            <>
                                {supportersInfo?.data && supportersInfo?.data.supporters && <span className="endcard-title">提　供</span>}
                                <br />
                                {supportersInfo?.data && supportersInfo?.data.supporters.map((elem) => {
                                    return (
                                        <span key={`${elem.supporterName}-${elem.userId}-${elem.contribution}`}>
                                            {elem.supporterName}
                                            <br />
                                        </span>
                                    )
                                })}
                            </>
                        )}

            </div>
            <div className="endcard-supporters-control">
                <button type="button" className="endcard-supporters-mute" onClick={handleMuteToggle}>
                    {isKokenMuted ? <IconVolume3 /> : <IconVolume />}
                </button>
                <button type="button" className="endcard-supporters-link" onClick={onSupportLinkClicked}>
                    この動画をニコニ広告する
                </button>
            </div>
            { supportersInfo?.data && !isKokenMuted && <audio autoPlay src={supportersInfo?.data.voiceUrl} ref={audioElemRef} /> }
        </div>

    )
}

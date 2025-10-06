import { IconCircleX, IconClock, IconDots, IconFolderFilled, IconMessageFilled, IconPlayerPlayFilled } from "@tabler/icons-react"
import { Card } from "../../Global/InfoCard"
import "./styles/videoItem.css"
import { useTransitionState } from "react-transition-state"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { Mylists } from "@/components/PMWatch/modules/Mylists"
import APIError from "@/utils/classes/APIError"

export function VideoItemCard({ video, markAsLazy, ...additionalAttributes }: { video: VideoItem, markAsLazy?: boolean }) {
    return (
        <div className="videoitem-wrapper" {...additionalAttributes}>
            <Card
                href={`https://www.nicovideo.jp/watch/${encodeURIComponent(video.id)}`}
                additionalClassName="videoitem-card"
                title={video.title}
                subTitle={(
                    <>
                        <a href={video.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${video.owner.id}` : `https://www.nicovideo.jp/user/${video.owner.id}`} className="videoitem-owner">
                            <img src={video.owner.iconUrl} className="videoitem-owner-icon" alt={`${video.owner.name} のアイコン`} />
                            <span className="videoitem-owner-name">{video.owner.name}</span>
                        </a>
                    </>
                )}
                shortDescription={video.shortDescription}
                counts={(
                    <>
                        <span className="videoitem-count">
                            <IconPlayerPlayFilled />
                            {readableInt(video.count.view, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconMessageFilled />
                            {readableInt(video.count.comment, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconFolderFilled />
                            {readableInt(video.count.mylist, 1)}
                        </span>
                        <span className="videoitem-count">
                            <IconClock />
                            {relativeTimeFrom(new Date(video.registeredAt))}
                        </span>
                    </>
                )}
                thumbnailUrl={video.thumbnail.listingUrl}
                thumbText={`${secondsToTime(video.duration)}`}
                thumbMarkAsLazy={markAsLazy}
                thumbChildren={(
                    <ExternalButton smId={video.id} title={video.title} />
                )}
            >
                {video.title}
            </Card>
        </div>
    )
}

function ExternalButton({ smId, title }: { smId: string, title: string }) {
    const { showAlert, showToast } = useSetMessageContext()
    const [isWatchLaterAdding, setIsWatchLaterAdding] = useState(false)
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 200,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
        preExit: true,
    })

    const handleAddToWatchLater = async () => {
        if (isWatchLaterAdding) return

        setIsWatchLaterAdding(true)
        try {
            await addToWatchLater(smId)
            showToast({
                title: "あとで見るに追加しました",
                body: title,
            })
        } catch (error) {
            console.error("Failed to add to watch later:", error)
            if (error instanceof APIError && error.response.meta.status === 409) {
                showAlert({
                    icon: <IconCircleX />,
                    title: "あとで見るへの追加に失敗しました",
                    body: "この動画はすでに追加済みです。",
                })
            } else {
                showAlert({
                    icon: <IconCircleX />,
                    title: "あとで見るへの追加に失敗しました",
                    body: "追加上限を超えていないか確認してください。それでも追加できない場合は、時間を置いて再度お試しください。",
                })
                setIsWatchLaterAdding(false)
            }
        }
    }

    return (
        <div className="info-card-externalbutton-wrapper">
            <button
                className="info-card-externalbutton"
                onClick={() => { toggle(!isMounted) }}
            >
                <IconDots />
            </button>
            { isMounted && (
                <div className="info-card-externalbutton-context" data-animation={status}>
                    <button
                        onClick={handleAddToWatchLater}
                        disabled={isWatchLaterAdding}
                    >
                        あとで見る
                    </button>
                    <button onClick={() => {
                        showAlert({
                            title: "マイリストに追加",
                            icon: null,
                            body: (
                                <div className="mylist-add-alert">
                                    <div className="mylist-add-alert-title">
                                        <strong>{title}</strong>
                                        {" "}
                                        をマイリストに追加します
                                    </div>
                                    <Mylists smId={smId} />
                                </div>
                            ),
                            customCloseButton: [
                                {
                                    key: "close",
                                    text: "おしまい",
                                    primary: true,
                                },
                            ],
                        })
                        toggle(false)
                    }}
                    >
                        マイリストに追加
                    </button>
                </div>
            )}
        </div>
    )
}

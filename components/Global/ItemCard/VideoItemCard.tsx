import { IconCancel, IconCircleX, IconClockFilled, IconDots } from "@tabler/icons-react"
import { Card } from "../InfoCard"
import "./styles/genericItem.css"
import { useTransitionState } from "react-transition-state"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { Mylists } from "@/components/PMWatch/modules/Mylists"
import APIError from "@/utils/classes/APIError"
import { InfoCardCount } from "../Count"

export function VideoItemCard({ video, markAsLazy, isVerticalLayout, ...additionalAttributes }: { video: VideoItem, markAsLazy?: boolean, isVerticalLayout?: boolean }) {
    if (video.isMuted) return (
        <Card
            additionalClassName="videoitem-card genericitem-card videoitem-muted"
            title="非表示に設定された動画"
            href={null}
            thumbChildren={(
                <>
                    <div className="videoitem-muted-overlay">
                        <IconCancel />
                    </div>
                </>
            )}
            data-is-vertical-layout={isVerticalLayout ? true : undefined}
            subTitle={(
                <></>
            )}
            counts={(
                <></>
            )}
            {...additionalAttributes}
        >
            <span className="videoitem-muted-text">非表示に設定された動画</span>
        </Card>
    )

    return (
        <Card
            href={`https://www.nicovideo.jp/watch/${encodeURIComponent(video.id)}`}
            additionalClassName="videoitem-card genericitem-card"
            title={video.title}
            subTitle={(
                <>
                    <a className="genericitem-owner" href={video.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${video.owner.id}` : `https://www.nicovideo.jp/user/${video.owner.id}`}>
                        <img src={video.owner.iconUrl} className="genericitem-owner-icon" alt={`${video.owner.name} のアイコン`} />
                        <span className="genericitem-owner-name">{video.owner.name}</span>
                    </a>
                    { isVerticalLayout && (
                        <span className="genericitem-time" data-count-type="registeredAt">
                            <IconClockFilled />
                            <span className="genericitem-time-value">
                                {relativeTimeFrom(new Date(video.registeredAt))}
                            </span>
                        </span>
                    ) }
                </>
            )}
            shortDescription={video.shortDescription}
            counts={(
                <InfoCardCount count={video.count} registeredAt={isVerticalLayout ? undefined : video.registeredAt} />
            )}
            thumbnailUrl={video.thumbnail.listingUrl}
            thumbText={`${secondsToTime(video.duration)}`}
            thumbMarkAsLazy={markAsLazy}
            thumbChildren={(
                <ExternalButton smId={video.id} title={video.title} />
            )}
            data-is-vertical-layout={isVerticalLayout ? true : undefined}
            {...additionalAttributes}
        >
            {video.title}
        </Card>
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

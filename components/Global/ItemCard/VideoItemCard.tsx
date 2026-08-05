import { IconCancel, IconCircleX, IconClock, IconClockFilled, IconDots, IconFolderPlus, IconShare } from "@tabler/icons-react"
import { Card } from "../InfoCard"
import "./styles/genericItem.css"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { Mylists } from "@/components/PMWatch/modules/Mylists"
import APIError from "@/utils/classes/APIError"
import { InfoCardCount } from "../Count"
import { ShareApplet } from "../Share"
import { VideoItemToShareBody } from "@/utils/videoShareUtils"
import { PopupMenu } from "../PopupMenu"

export function VideoItemCard({ video, markAsLazy, layoutType, showStats = true, externalVideoActionChildren, ...additionalAttributes }: {
    video: VideoItem
    markAsLazy?: boolean
    layoutType?: "horizontal" | "horizontal-simple" | "vertical-simple"
    showStats?: boolean
    externalVideoActionChildren?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
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
            data-layout={layoutType}
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
                    <a className="genericitem-owner" href={video.owner.ownerType === "channel" ? `https://ch.nicovideo.jp/${video.owner.id}` : `https://www.nicovideo.jp/user/${video.owner.id}`} data-owner-visibility={video.owner.visibility}>
                        { video.owner.iconUrl && (
                            <img src={video.owner.iconUrl} className="genericitem-owner-icon" alt={`${video.owner.name ?? "非公開または退会済みユーザー"} のアイコン`} />
                        ) }
                        <span className="genericitem-owner-name">{video.owner.name ?? "非公開または退会済みユーザー"}</span>
                    </a>
                    { layoutType === "vertical-simple" && (
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
                showStats && <InfoCardCount count={video.count} registeredAt={layoutType === "vertical-simple" ? undefined : video.registeredAt} />
            )}
            thumbnailUrl={video.contentType === "short" ? video.thumbnail.shortUrl : video.thumbnail.listingUrl}
            thumbText={`${secondsToTime(video.duration)}`}
            thumbMarkAsLazy={markAsLazy}
            thumbChildren={(
                <>
                    { video.playbackPosition
                        ? (
                                <div className="genericitem-resume" style={{ ["--width" as any]: `${(video.playbackPosition / video.duration) * 100}%` }}>
                                </div>
                            )
                        : null }
                    <ExternalButton video={video}>
                        {externalVideoActionChildren}
                    </ExternalButton>
                </>
            )}
            data-layout={layoutType}
            data-is-short={video.contentType === "short"}
            {...additionalAttributes}
        >
            {video.title}
        </Card>
    )
}

function ExternalButton({ video, children }: { video: VideoItem, children?: React.ReactNode }) {
    const { id: smId, title } = video

    const { showAlert, showToast } = useSetMessageContext()
    const [isWatchLaterAdding, setIsWatchLaterAdding] = useState(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

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

    const handleShareOpen = () => {
        const shareURL = `https://www.nicovideo.jp/watch/${smId}`
        const body = VideoItemToShareBody(video)
        const ogp = {
            title: video.title,
            image: video.thumbnail.listingUrl,
            description: null,
            siteName: "ニコニコ動画",
        }
        showAlert({
            title: "共有",
            icon: null,
            body: (
                <ShareApplet body={body} plainUrl={shareURL} ogp={ogp} />
            ),
            customCloseButton: [
                {
                    key: "close",
                    text: "おしまい",
                    primary: true,
                },
            ],
        })
        setIsPopupOpen(false)
    }

    const handleAddToMylistOpen = () => {
        showAlert({
            title: "マイリストに追加",
            icon: null,
            body: (
                <div className="applet-container mylist-add-alert">
                    <div className="applet-subtitle">
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
        setIsPopupOpen(false)
    }

    const handlePopupToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsPopupOpen(s => !s)
        e.stopPropagation()
    }

    return (
        <div className="info-card-externalbutton-wrapper">
            {children}
            <button
                className="info-card-externalbutton"
                onClick={handlePopupToggle}
                ref={buttonRef}
                data-is-active={isPopupOpen}
            >
                <IconDots />
            </button>
            <PopupMenu isOpen={isPopupOpen} onClose={() => { setIsPopupOpen(false) }} positionElemRef={buttonRef}>
                <button
                    className="generic-contextmenu-item"
                    onClick={handleShareOpen}
                >
                    <IconShare />
                    <span>
                        共有
                    </span>
                </button>
                <button
                    className="generic-contextmenu-item"
                    onClick={handleAddToWatchLater}
                    disabled={isWatchLaterAdding}
                >
                    <IconClock />
                    <span>
                        あとで見る
                    </span>
                </button>
                <button
                    className="generic-contextmenu-item"
                    onClick={handleAddToMylistOpen}
                >
                    <IconFolderPlus />
                    <span>
                        マイリストに追加
                    </span>
                </button>
            </PopupMenu>
        </div>
    )
}

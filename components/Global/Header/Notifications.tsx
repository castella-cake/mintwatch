import { useOshiraseBoxData } from "@/hooks/apiHooks/global/oshiraseBox"
import { NotificationCard } from "./NotificationCard"
import { IconExternalLink, IconSettings } from "@tabler/icons-react"

function onNotificationClick(id: string, isRead: boolean) {
    if (isRead) return
    sendOshiraseBoxRead(id, location.toString())
}

export default function Notifications() {
    const { oshiraseBoxData } = useOshiraseBoxData()
    return (
        <div className="notifications-container" id="pmw-notifications">
            <div className="header-action-title">
                <div className="header-action-title-left">
                    <span>通知</span>
                    { oshiraseBoxData && oshiraseBoxData.data.importantUnreadCount > 0
                        && (
                            <a href="https://inform.nicovideo.jp/oshirase/list/important" target="_blank" rel="noreferrer" className="header-action-title-subtext" data-is-important="true">
                                重要な通知
                                {" "}
                                {oshiraseBoxData.data.importantUnreadCount}
                                {" 件"}
                            </a>
                        )}
                </div>
                <div className="header-action-title-right">
                    <a
                        href="https://inform.nicovideo.jp/oshirase/settings"
                        className="header-action-title-button"
                        target="_blank"
                        rel="noreferrer"
                        title="お知らせ設定を開く (別タブで開きます)"
                    >
                        <IconSettings />
                    </a>
                    <a
                        href="https://inform.nicovideo.jp/oshirase/list"
                        className="header-action-title-button"
                        target="_blank"
                        rel="noreferrer"
                        title="お知らせ一覧を開く (別タブで開きます)"
                    >
                        <IconExternalLink />
                    </a>
                </div>
            </div>
            <div className="notifications-content">
                {
                    oshiraseBoxData && oshiraseBoxData.data.notifications.map((item, index) => {
                        return <NotificationCard obj={item} onClick={onNotificationClick} markAsLazy={index >= 5} key={`notification-${item.id}`} />
                    })
                }
            </div>
        </div>
    )
}

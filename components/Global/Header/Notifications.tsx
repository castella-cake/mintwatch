import { useOshiraseBoxData } from "@/hooks/apiHooks/global/oshiraseBox"
import { NotificationCard } from "./NotificationCard"

function onNotificationClick(id: string, isRead: boolean) {
    if (isRead) return
    sendOshiraseBoxRead(id, location.toString())
}

export default function Notifications() {
    const oshiraseBoxData = useOshiraseBoxData()
    return (
        <div className="notifications-container" id="pmw-notifications">
            <div className="header-action-title">
                <div className="header-action-title-left"></div>
                <div className="header-action-title-center">通知</div>
                <div className="header-action-title-right"></div>
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

import { useOshiraseBoxData } from "@/hooks/apiHooks/global/oshiraseBox";

function onNotificationClick(id: string, isRead: boolean) {
    if (isRead) return;
    sendOshiraseBoxRead(id, location.toString())
}

export default function Notifications() {
    const oshiraseBoxData = useOshiraseBoxData()
    return (
        <div className="notifications-container" id="pmw-notifications">
            <div className="notifications-content">
                {
                    oshiraseBoxData && oshiraseBoxData.data.notifications.map((item,index) => {
                        return <a className="notification-item" key={`notification-${item.id}`} href={item.onClick.pc} onClick={() => {onNotificationClick(item.id, item.read)}}target="_blank" data-isread={item.read.toString()} data-isimportant={item.important.toString()}>
                            <img src={item.icon} className="notification-item-icon" alt="通知のアイコン"></img>
                            <div className="notification-item-title">{item.title}</div>
                            {item.content && <div className="notification-item-content">
                                { item.content.icon && <img src={item.content.icon} className="notification-item-content-icon" alt="コンテンツのアイコン"/> }
                                <div className="notification-item-content-text">
                                    {item.content.title}
                                </div>
                            </div>}
                            <div className="notification-item-date">{new Date(
                                item.createdAt
                            ).toLocaleString("ja-JP")}</div>
                        </a>
                    })
                }
            </div>
        </div>
    );
}
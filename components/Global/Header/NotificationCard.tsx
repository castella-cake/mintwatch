import { OshiraseNotification } from "@/types/OshiraseBoxData"

export function NotificationCard({ obj, onClick, markAsLazy }: { obj: OshiraseNotification, onClick?: (id: string, read: boolean) => void, markAsLazy?: boolean }) {
    return (
        <a
            className="notification-item"
            href={obj.onClick.pc}
            onClick={() => { if (onClick) onClick(obj.id, obj.read) }}
            target="_blank"
            data-isread={obj.read.toString()}
            data-isimportant={obj.important.toString()}
            rel="noreferrer"
        >
            <img src={obj.icon} className="notification-item-icon" alt="通知のアイコン" loading={markAsLazy ? "lazy" : undefined}></img>
            <div className="notification-item-title">{obj.title}</div>
            {obj.content && (
                <div className="notification-item-content">
                    { obj.content.icon && <img src={obj.content.icon} className="notification-item-content-icon" alt="コンテンツのアイコン" loading={markAsLazy ? "lazy" : undefined} /> }
                    <div className="notification-item-content-text">
                        {obj.content.title}
                    </div>
                </div>
            )}
            <div className="notification-item-date">
                {new Date(
                    obj.createdAt,
                ).toLocaleString("ja-JP")}
            </div>
        </a>
    )
}

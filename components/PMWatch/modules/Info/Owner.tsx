import { ReactNode } from "react"

export default function OwnerInfo({ id, iconUrl, name, isChannel, children }: {
    id: string | number,
    iconUrl?: string,
    name?: string,
    isChannel?: boolean,
    children?: ReactNode
}) {
    const userName = name ?? "非公開または退会済みユーザー"

    return <div className="videoinfo-owner">
        <a
            href={`${isChannel ? "https://ch.nicovideo.jp/" : "https://www.nicovideo.jp/user/"}${id}`}
        >
            {iconUrl && (
                <img
                    src={iconUrl}
                    alt={`${userName} のアイコン`}
                />
            )}
            <span>{userName}</span>
        </a>
        {children}
    </div>
}
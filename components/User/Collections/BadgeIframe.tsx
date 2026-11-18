import { GuestIframe } from "../GenericComponents/GuestIframe"

export function BadgeIframe({ userId }: { userId: number }) {
    return (
        <GuestIframe src={`https://site.nicovideo.jp/badge_archive?user_id=${userId}`} />
    )
}

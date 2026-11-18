import { GuestIframe } from "../GenericComponents/GuestIframe"

export function LiveProgramsContent({ userId, nickname }: { userId: number, nickname?: string }) {
    return (
        <>
            <title>{`${nickname}さんの生放送 - ニコニコ`}</title>
            <GuestIframe src={`https://live.nicovideo.jp/embed/broadcast-history?userId=${userId}`} />
        </>
    )
}

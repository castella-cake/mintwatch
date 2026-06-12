import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { Videos } from "./Videos"
import "../styles/VideosContent.css"

export function VideosContent({ userId, nickname }: { userId: number, nickname?: string }) {
    return (
        <div className="user-videos user-category-container">
            <div className="user-videos-sidearea user-category-sidearea">
                <NavigationAnchorButton href={`/user/${userId}/video`}>
                    動画
                </NavigationAnchorButton>
                <NavigationAnchorButton href={`/user/${userId}/shorts`}>
                    ショート
                </NavigationAnchorButton>
            </div>
            <Match targetPathname={[
                `/user/${userId}/video`,
            ]}
            >
                <title>{ nickname ? `${nickname}さんの公開動画 - ニコニコ` : "動画 - ニコニコ" }</title>
                <Videos userId={userId} />
            </Match>
            <Match targetPathname={[
                `/user/${userId}/shorts`,
            ]}
            >
                <title>{ nickname ? `${nickname}さんの公開ショート - ニコニコ` : "ショート - ニコニコ" }</title>
                <Videos userId={userId} contentType="short" />
            </Match>
        </div>
    )
}

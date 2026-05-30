import { Match } from "@/components/Router/RouterUI"
import { NavigationAnchorButton } from "../Navigation"
import { Videos } from "./Videos"
import "../styles/VideosContent.css"

export function VideosContent({ userId }: { userId: number }) {
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
                <Videos userId={userId} />
            </Match>
            <Match targetPathname={[
                `/user/${userId}/shorts`,
            ]}
            >
                <Videos userId={userId} contentType="short" />
            </Match>
        </div>
    )
}

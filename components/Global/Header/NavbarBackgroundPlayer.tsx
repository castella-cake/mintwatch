import { useHistoryContext } from "@/components/Router/RouterContext";
import { useBackgroundPlayHrefRefContext, useBackgroundPlayInfoContext, useBackgroundPlayingContext, useSetBackgroundPlayingContext } from "../Contexts/BackgroundPlayProvider";
import { useVideoRefContext } from "../Contexts/VideoDataProvider";
import { IconScreenShare, IconX } from "@tabler/icons-react";

export default function NavbarBackgroundPlayer() {
    const history = useHistoryContext()
    const backgroundPlaying = useBackgroundPlayingContext()
    const videoRef = useVideoRefContext()
    const backgroundPlayInfo = useBackgroundPlayInfoContext()
    const backgroundPlayHrefRef = useBackgroundPlayHrefRefContext()

    const setBackgroundPlaying = useSetBackgroundPlayingContext()

    const closeBackground = useCallback(() => {
        setBackgroundPlaying(false)
    }, [])

    if (!backgroundPlaying) return

    return <div className="navbar-background-player-container">
        <img className="navbar-background-player-thumbnail" src={backgroundPlayInfo.thumbnailSrc}/>
        <div className="navbar-background-player-title">
            <span className="navbar-background-player-title-subtitle">再生中</span>
            <br/>
            <span className="navbar-background-player-title-video">{backgroundPlayInfo.title ?? "タイトル不明"}</span>  
        </div>
        <button className="navbar-background-player-action" onClick={closeBackground} title="バックグラウンド再生を終了"><IconX/></button>
    </div>
}
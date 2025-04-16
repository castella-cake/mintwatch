import { Dispatch, JSX, MouseEvent, SetStateAction } from "react"
import Actions from "./modules/Info/Actions"
import CommentList from "./modules/CommentList/CommentList"
import Info, { VideoTitle } from "./modules/Info/Info"
import Player from "./modules/PlayerUI/Player"
import Playlist from "./modules/Playlist"
import { Stacker } from "./modules/Stacker"
import { NicoHarajukuLogo, Owner, Stats } from "./modules/ShinjukuUI"
import WatchNext from "./modules/WatchNext/WatchNext"
import SeriesInfo from "./modules/Info/Series"
import BottomInfo from "./modules/Info/BottomInfo"
import Search from "./modules/Search"
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider"
import { useHistoryContext } from "../Router/RouterContext"

export const watchLayoutType = {
    reimaginedNewWatch: "renew",
    reimaginedOldWatch: "recresc",
    Stacked: "stacked",
    threeColumn: "3col",
    shinjuku: "shinjuku",
    gridTest: "gridtest",
}

type Props = {
    layoutType: string,
    playerSize: number,
    onChangeVideo: (smId: string) => void,
    isFullscreenUi: boolean,
    setIsFullscreenUi: Dispatch<SetStateAction<boolean>>,
}

export function WatchContent(_props: Props) {
    const history = useHistoryContext()
    const {
        layoutType,
        playerSize,
        onChangeVideo,
        isFullscreenUi,
        setIsFullscreenUi
    } = _props
    const { localStorage } = useStorageContext()

    useEffect(() => {
        document.dispatchEvent(
            new CustomEvent("pmw_initialRender", {
                detail: ""
            }),
        );
    }, [])

    const setVideoActionModalState = useSetVideoActionModalStateContext()

    const onModalStateChanged = useCallback((
        isModalOpen: boolean,
        modalType: "mylist" | "share" | "help" | "shortcuts",
    ) => {
        if (isModalOpen === false) {
            setVideoActionModalState(false);
        } else {
            setVideoActionModalState(modalType);
        }
    }, [])

    const linkClickHandler = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            const nearestAnchor: HTMLAnchorElement | null = e.target.closest("a")
            // data-seektimeがある場合は、mousecaptureな都合上スキップする。
            if (nearestAnchor && nearestAnchor.href.startsWith("https://www.nicovideo.jp/watch/") && !nearestAnchor.getAttribute("data-seektime")) {
                // 別の動画リンクであることが確定したら、これ以上イベントが伝播しないようにする
                e.stopPropagation()
                e.preventDefault()
                history.push(nearestAnchor.href)
                //onChangeVideo(nearestAnchor.href)
            }
        }
    }

    const shouldUseCardRecommend = !(layoutType === watchLayoutType.Stacked || layoutType === watchLayoutType.reimaginedNewWatch) ? true : false
    const shouldUseHorizontalSearchLayout = !(layoutType === watchLayoutType.shinjuku || layoutType === watchLayoutType.reimaginedOldWatch) ? true : false
    const shouldUseCardInfo = !(layoutType === watchLayoutType.reimaginedOldWatch || layoutType === watchLayoutType.shinjuku) ? true : false
    const shouldUseBigView = localStorage.playersettings.enableBigView ?? false

    const playerElem = <Player
        isFullscreenUi={isFullscreenUi}
        setIsFullscreenUi={setIsFullscreenUi}
        changeVideo={onChangeVideo}
        onModalStateChanged={onModalStateChanged}
        key="watchui-player"
    />
    const titleElem = <VideoTitle key="watch-container-title" />
    const infoElem = <Info isTitleShown={layoutType !== watchLayoutType.threeColumn} isShinjukuLayout={layoutType === watchLayoutType.shinjuku} key="watchui-info" />
    const commentListElem = <CommentList key="watchui-commentlist" />
    const playListElem = <Playlist key="watchui-playlist" />
    const actionsElem = <Actions onModalOpen={(modalType: "mylist" | "share" | "help") => { onModalStateChanged(true, modalType) }} key="watchui-actions"></Actions>
    const rightActionElem = <div className="watch-container-rightaction" key="watchui-rightaction">
        {layoutType === watchLayoutType.shinjuku ?
            <div className="watch-container-rightaction-hjleft">
                <Stats />
            </div> : actionsElem
        }
        <Stacker items={[{ title: "コメントリスト", content: commentListElem }, { title: "動画概要", content: infoElem, disabled: (layoutType !== watchLayoutType.Stacked) }, { title: "再生リスト", content: playListElem }]} />
    </div>
    const combinedPlayerElem = <div className="shinjuku-player-container" key="watchui-combinedplayer">
        {playerElem}{rightActionElem}
    </div>
    const watchNextElem = <WatchNext key="watchui-recommend" enableWheelTranslate={shouldUseCardRecommend} />
    const seriesElem = <SeriesInfo key="watchui-series" />
    const bottomInfoElem = <BottomInfo key="watchui-bottominfo" />
    const searchElem = <Search key="watchui-search" />
    const ownerElem = <Owner key="watchui-owner" />
    const hrjkLogoElem = <div className="hrjk-header" key="watchui-hrjkheader"><NicoHarajukuLogo />{searchElem}<div className="harajuku-header-migiue-filler">MintWatch</div></div>

    const layoutPresets: {
        [key: string]: JSX.Element[]
    } = {
        "renew": [playerElem, rightActionElem, infoElem, seriesElem, bottomInfoElem, searchElem, watchNextElem],
        "recresc": [infoElem, searchElem, playerElem, rightActionElem, seriesElem, bottomInfoElem, watchNextElem],
        "stacked": [playerElem, rightActionElem, bottomInfoElem, seriesElem, searchElem, watchNextElem],
        "3col": [titleElem, infoElem, playerElem, rightActionElem, watchNextElem, seriesElem, bottomInfoElem, searchElem],
        "rerekari": [playerElem, rightActionElem, infoElem, seriesElem, bottomInfoElem, watchNextElem, searchElem],
        "shinjuku": [hrjkLogoElem, infoElem, ownerElem, actionsElem, combinedPlayerElem, seriesElem, watchNextElem, bottomInfoElem],
    }

    const currentLayout = layoutPresets[layoutType]

    return <div className="watch-container"
        is-bigview={shouldUseBigView.toString()}
        watch-type={layoutType.toString()}
        settings-size={playerSize.toString()}
        use-card-recommend={shouldUseCardRecommend.toString()}
        use-horizontal-search={shouldUseHorizontalSearchLayout.toString()}
        use-card-info={shouldUseCardInfo.toString()}
        id="pmw-container"
        onClickCapture={(e) => { linkClickHandler(e) }}
    >
        <div className="watch-container-grid">
            {currentLayout}
        </div>
    </div>
}

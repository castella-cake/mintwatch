import ReactFocusLock from "react-focus-lock"
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import { NavigationObject, SeparatorItem, SideMenuItem } from "./NavigationObjects"
import { IconPencil, IconX } from "@tabler/icons-react"
import { useDraggable } from "@dnd-kit/core"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import MintToolBox from "./MintToolBox"
import { ZSnowBackground } from "./ZSnow"
import { useTransitionState } from "react-transition-state"

type SideMenuEntry = SideMenuItem | SeparatorItem
const SideMenuContents: SideMenuEntry[] = [
    NavigationObject.recommendations,
    NavigationObject.timeline,
    { type: "separator" },
    NavigationObject.mylist,
    NavigationObject.watchLater,
    NavigationObject.history,
    NavigationObject.likeHistory,
    { type: "separator" },
    NavigationObject.ranking,
    { type: "separator" },
    NavigationObject.nAnime,
    NavigationObject.premiumOnlyVideos,
]

function SideMenuItem({ item, isEditMode }: { item: SideMenuItem, isEditMode: boolean }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidemenu-${item.id}`,
        data: { navigationItemId: item.id },
        disabled: !isEditMode,
    })
    const style = {
        ...(isDragging && { pointerEvents: ("none" as React.CSSProperties["pointerEvents"]) }),
    }
    return (
        <a href={item.href} className="sidemenu-item" ref={setNodeRef} {...attributes} {...listeners} style={style} aria-disabled="false">
            {item.icon ?? <></>}
            <span className="sidemenu-item-label">{item.label}</span>
        </a>
    )
}

export default function SideMenu({ nodeRef, isEditMode, setIsEditMode, showMintToolBox, displayMode = "overlay" }: { nodeRef: React.RefObject<HTMLDivElement | null>, isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>>, showMintToolBox: boolean, displayMode?: "overlay" | "dock" }) {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 300,
        preEnter: true,
        mountOnEnter: true,
        unmountOnExit: true,
    })

    const { disableSeasonalEffects } = useStorageVar(["disableSeasonalEffects"])
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()
    const isDockMode = displayMode === "dock"
    const isCollapsed = isDockMode && !isSideMenuShown
    const [previousCollapsed, setPreviousCollapsed] = useState(false)
    const wasCollapsedDuringExit = status === "exiting" ? previousCollapsed : isCollapsed

    // ここでのnodeRefは、transitionではなく単に外側をクリックした場合に閉じるために使う。Transitionは内部で用意する。
    const wrapperTransitionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (status !== "exiting") setPreviousCollapsed(isCollapsed)
    }, [isCollapsed, status])

    if ((!isMounted && isSideMenuShown) || (isDockMode && !isMounted)) {
        toggle(true)
    }
    if (isMounted && (!isSideMenuShown && !isDockMode)) {
        toggle(false)
    }

    if (!isMounted) return null

    return (
        <div className="sidemenu-wrapper" data-animation={status} ref={wrapperTransitionRef} data-is-collapsed={isCollapsed} data-was-collapsed={wasCollapsedDuringExit} data-display-mode={displayMode}>
            { !disableSeasonalEffects && isItWinterSeason() && <ZSnowBackground /> }
            <ReactFocusLock disabled={isDockMode && !isSideMenuShown}>
                <div className="sidemenu-container" ref={nodeRef}>
                    <button className="sidemenu-closebutton" onClick={() => setIsSideMenuShown(false)} title="サイドメニューを閉じる"><IconX /></button>
                    {
                        SideMenuContents.map((item, index) => {
                            if ("type" in item && item.type === "separator") {
                                return <div className="sidemenu-separator" key={index} />
                            }
                            if ("href" in item) return (
                                <SideMenuItem key={index} item={item} isEditMode={isEditMode} />
                            )
                        })
                    }

                    { !wasCollapsedDuringExit && (
                        <>
                            <button className="sidemenu-editmode-button" onClick={() => setIsEditMode(!isEditMode)}>
                                <IconPencil />
                                <span>{isEditMode ? "編集を終了" : "カスタムエリアを編集"}</span>
                            </button>
                            {showMintToolBox && <MintToolBox quietWhatsNew={true} />}
                        </>
                    ) }
                </div>
            </ReactFocusLock>
        </div>
    )
}

const winterMonths = [12, 1, 2]

const isItWinterSeason = () => {
    const now = new Date()
    const month = now.getMonth() + 1 // JavaScriptの月は0から始まるため、1を加える
    return winterMonths.includes(month)
}

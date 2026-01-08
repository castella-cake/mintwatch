import ReactFocusLock from "react-focus-lock"
import { CSSTransition } from "react-transition-group"
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import { NavigationObject, SeparatorItem, SideMenuItem } from "./NavigationObjects"
import { IconPencil, IconX } from "@tabler/icons-react"
import { useDraggable } from "@dnd-kit/core"
import { Dispatch, SetStateAction } from "react"
import MintToolBox from "./MintToolBox"
import { ZSnowBackground } from "./ZSnow"

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

export default function SideMenu({ nodeRef, isEditMode, setIsEditMode, showMintToolBox }: { nodeRef: React.RefObject<HTMLDivElement | null>, isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>>, showMintToolBox: boolean }) {
    const { disableSeasonalEffects } = useStorageVar(["disableSeasonalEffects"])
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()

    // ここでのnodeRefは、transitionではなく単に外側をクリックした場合に閉じるために使う。Transitionは内部で用意する。
    const wrapperTransitionRef = useRef<HTMLDivElement>(null)
    return (
        <CSSTransition
            nodeRef={wrapperTransitionRef}
            in={
                isSideMenuShown
            }
            timeout={300}
            unmountOnExit
            classNames="sidemenu-transition"
        >

            <div className="sidemenu-wrapper" ref={wrapperTransitionRef}>
                { !disableSeasonalEffects && isItWinterSeason() && <ZSnowBackground /> }
                <ReactFocusLock>
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
                        <button className="sidemenu-editmode-button" onClick={() => setIsEditMode(!isEditMode)}>
                            <IconPencil />
                            <span>{isEditMode ? "編集を終了" : "カスタムエリアを編集"}</span>
                        </button>
                        { showMintToolBox && <MintToolBox quietWhatsNew={true} /> }
                    </div>
                </ReactFocusLock>
            </div>
        </CSSTransition>
    )
}

const winterMonths = [12, 1, 2]

const isItWinterSeason = () => {
    const now = new Date()
    const month = now.getMonth() + 1 // JavaScriptの月は0から始まるため、1を加える
    return winterMonths.includes(month)
}

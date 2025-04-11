import ReactFocusLock from "react-focus-lock"
import { CSSTransition } from "react-transition-group"
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../Contexts/ModalStateProvider"
import { NavigationObject, SeparatorItem, SideMenuItem } from "./NavigationObjects"
import { IconX } from "@tabler/icons-react"

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

export default function SideMenu({ nodeRef }: { nodeRef: React.RefObject<HTMLDivElement | null> }) {
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()

    // ここでのnodeRefは、transitionではなく単に外側をクリックした場合に閉じるために使う。Transitionは内部で用意する。
    const wrapperTransitionRef = useRef<HTMLDivElement>(null)
    return <CSSTransition
        nodeRef={wrapperTransitionRef}
        in={
            isSideMenuShown
        }
        timeout={300}
        unmountOnExit
        classNames="sidemenu-transition"
    >

        <div className="sidemenu-wrapper" ref={wrapperTransitionRef}>
            <ReactFocusLock>
                <div className="sidemenu-container" ref={nodeRef}>
                    <button className="sidemenu-closebutton" onClick={() => setIsSideMenuShown(false)} title="サイドメニューを閉じる"><IconX/></button>
                    {
                        SideMenuContents.map((item, index) => {
                            if ('type' in item && item.type === "separator") {
                                return <div className="sidemenu-separator" key={index} />
                            }
                            if ('href' in item) return (
                                <a key={index} href={item.href} className="sidemenu-item">
                                    {item.icon ?? <></>}
                                    <span className="sidemenu-item-label">{item.label}</span>
                                </a>
                            )
                        })
                    }
                </div>
            </ReactFocusLock>
        </div>
    </CSSTransition>
}
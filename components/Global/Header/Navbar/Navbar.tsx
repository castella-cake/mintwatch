import Search from "@/components/Global/Search"
import { IconMenu2 } from "@tabler/icons-react"
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import NavbarCustomArea from "./NavbarCustomArea"
import { Dispatch, SetStateAction } from "react"
import NavbarBackgroundPlayer from "./NavbarBackgroundPlayer"
import HelpTools from "./HelpTools"
import { NicoHarajukuLogo } from "@/components/PMWatch/modules/ShinjukuUI"

export default function Navbar({ isEditMode, setIsEditMode, isShinjukuMode }: { isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>>, isShinjukuMode?: boolean }) {
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()
    return (
        <div className="navbar-container" id="pmw-navbar">
            { !isShinjukuMode && (
                <button
                    className="navbar-sidemenu-button"
                    title="サイドメニューを切り替え"
                    onClick={() => setIsSideMenuShown(!isSideMenuShown)}
                    data-is-active={isSideMenuShown}
                >
                    <IconMenu2 />
                </button>
            ) }
            <div className="navbar-logo">
                { isShinjukuMode
                    ? <NicoHarajukuLogo />
                    : (
                            <a href="https://www.nicovideo.jp/video_top" title="ニコニコ動画" className="navbar-logo-link">
                            </a>
                        )}
            </div>
            <Search />
            { isShinjukuMode
                ? (
                        <>
                            <div className="harajuku-header-migiue-filler">MintWatch</div>
                        </>
                    )
                : (
                        <>
                            <NavbarCustomArea isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
                            <div className="navbar-right-separator" />
                            <NavbarBackgroundPlayer />
                            <HelpTools />
                        </>
                    )}

        </div>
    )
}

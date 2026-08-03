import Search from "@/components/Global/SearchBar/Search"
import { IconMenu2 } from "@tabler/icons-react"
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import { MWButton } from "../../MWButton"
import NavbarCustomArea from "./NavbarCustomArea"
import { Dispatch, SetStateAction } from "react"
import MintToolBox from "./MintToolBox"
import { NicoHarajukuLogo, RandomHidariueImg } from "@/components/PMWatch/modules/ShinjukuUI"
import whatsNewData from "@/assets/whatsnew.json"

export default function Navbar({ isEditMode, setIsEditMode, isShinjukuMode, children }: { isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>>, isShinjukuMode?: boolean, children?: React.ReactNode }) {
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()
    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])

    return (
        <nav className="navbar-container" id="pmw-navbar">
            <MWButton
                label="サイドメニューを切り替え"
                className="navbar-sidemenu-button"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsSideMenuShown(!isSideMenuShown)
                }}
                data-is-active={isSideMenuShown}
                data-has-update={lastCheckedUpdate !== whatsNewData.version}
            >
                { isShinjukuMode ? <RandomHidariueImg /> : <IconMenu2 /> }
            </MWButton>
            <div className="navbar-logo">
                { isShinjukuMode
                    ? <NicoHarajukuLogo />
                    : (
                            <a href="https://www.nicovideo.jp/video_top" title="ニコニコ動画" className="navbar-logo-link">
                            </a>
                        )}
            </div>
            <Search enableHotKey={true} />
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
                            {children}
                            <MintToolBox omitKeys={["vanilla", "settings"]} />
                        </>
                    )}

        </nav>
    )
}

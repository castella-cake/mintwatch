import Search from "@/components/Global/Search";
import { IconMenu2 } from "@tabler/icons-react";
import { useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider";
import NavbarCustomArea from "./NavbarCustomArea";
import { Dispatch, SetStateAction } from "react";
import NavbarBackgroundPlayer from "./NavbarBackgroundPlayer";
import WhatsNewTitle from "./WhatsNewTitle";

export default function Navbar({ isEditMode, setIsEditMode }: { isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>> } ) {
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()
    return <div className="navbar-container" id="pmw-navbar">
        <button
            className="navbar-sidemenu-button"
            title="サイドメニューを切り替え"
            onClick={() => setIsSideMenuShown(!isSideMenuShown)}
            data-is-active={isSideMenuShown}
        >
            <IconMenu2/>
        </button>
        <div className="navbar-logo">
            <a href="https://www.nicovideo.jp/video_top" title="ニコニコ動画">
            </a>
        </div>
        <Search/>
        <NavbarCustomArea isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>
        <div className="navbar-right-separator"/>
        <NavbarBackgroundPlayer/>
        <WhatsNewTitle/>
    </div>
}
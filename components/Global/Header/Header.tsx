// import { useState } from "react";
import { IconDoorExit, IconTool } from "@tabler/icons-react"
import { useSetMintConfigShownContext } from "../Contexts/ModalStateProvider"
import { HeaderActionStacker } from "./HeaderActionStacker"
import { RefObject } from "react"
import Navbar from "./Navbar/Navbar"
import SideMenu from "./Navbar/SideMenu"
import { NavigationDndWrapper } from "./Navbar/NavigationCustomDragContext"
import { NicoServiceLinks } from "./NicoServiceLinks"
import { MyButtons } from "./MyButtons"

function onVanillaPageReturn() {
    location.href = `${location.href}${location.href.includes("?") ? "&" : "?"}nopmw=true`
}

function Header({ headerActionStackerElemRef, sideMenuElemRef }: { headerActionStackerElemRef: RefObject<HTMLDivElement | null>, sideMenuElemRef: RefObject<HTMLDivElement | null> }) {
    // const [hover, setHover] = useState(false)
    const syncStorage = useStorageVar(["enableFixedHeader", "pmwlayouttype", "shinjukuEnableNavbar", "navbarType", "headerActionType", "enableOmniHeader"] as const)

    const setIsMintConfigShown = useSetMintConfigShownContext()

    const isFixedHeaderEnabled = syncStorage.enableFixedHeader ?? getDefault("enableFixedHeader")
    const isShinjukuNavbar = syncStorage.pmwlayouttype === "shinjuku" && !syncStorage.shinjukuEnableNavbar && !syncStorage.enableOmniHeader
    const isOmniHeaderEnabled = syncStorage.enableOmniHeader ?? getDefault("enableOmniHeader")
    const navbarType = isShinjukuNavbar ? "shinjuku" : syncStorage.navbarType ?? getDefault("navbarType")
    const headerActionType = syncStorage.headerActionType ?? getDefault("headerActionType")
    const isSetToQuickHeaderAction = headerActionType === "quick"

    const [isEditMode, setIsEditMode] = useState(false)

    return (
        <NavigationDndWrapper>
            <div
                className="header-container"
                id="pmw-header"
                data-is-fixed={isFixedHeaderEnabled}
                data-navbar-type={navbarType}
                data-is-omni-header={isOmniHeaderEnabled}
            >
                { isOmniHeaderEnabled
                    ? (
                            <header className="omniheader-container">
                                <Navbar isEditMode={isEditMode} setIsEditMode={setIsEditMode} isShinjukuMode={isShinjukuNavbar}>
                                    <div className="omniheader-items">
                                        <NicoServiceLinks />
                                        <div className="omniheader-separator" />
                                        <MyButtons isQuickHeaderAction={true} />
                                    </div>
                                </Navbar>
                            </header>
                        )
                    : (
                            <>
                                <header className="header-upper-container global-flex">
                                    <div className="global-flex1 header-left-container global-flex">
                                        <button
                                            onClick={() => {
                                                setIsMintConfigShown(current => current === false ? "quick" : false)
                                            }}
                                            title="MintWatch の設定"
                                        >
                                            <IconTool />
                                        </button>
                                    </div>
                                    <div className="global-flex1 global-flex header-center-container">
                                        <div className="header-center-left">
                                            <NicoServiceLinks />
                                        </div>
                                        <div className="header-center-right">
                                            <div className="global-flex header-usercontainer">
                                                <MyButtons isQuickHeaderAction={isSetToQuickHeaderAction} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="global-flex1 global-flex header-right-container">
                                        <button
                                            onClick={onVanillaPageReturn}
                                            title="元のページを表示"
                                        >
                                            <IconDoorExit />
                                        </button>
                                    </div>
                                </header>
                                <div className="header-bottom-container">
                                    <Navbar isEditMode={isEditMode} setIsEditMode={setIsEditMode} isShinjukuMode={isShinjukuNavbar} />
                                </div>
                            </>
                        )}
                <SideMenu nodeRef={sideMenuElemRef} isEditMode={isEditMode} setIsEditMode={setIsEditMode} showMintToolBox={isOmniHeaderEnabled} />
                { !isSetToQuickHeaderAction && <HeaderActionStacker nodeRef={headerActionStackerElemRef} /> }
            </div>
        </NavigationDndWrapper>
    )
}

export default Header

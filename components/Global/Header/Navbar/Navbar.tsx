import Search from "@/components/Global/SearchBar/Search"
import { IconMenu2 } from "@tabler/icons-react"
import { useSetMintConfigShownContext, useSetSideMenuShownContext, useSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import { MWButton } from "../../MWButton"
import NavbarCustomArea from "./NavbarCustomArea"
import { Dispatch, SetStateAction } from "react"
import MintToolBox from "./MintToolBox"
import { NicoHarajukuLogo, RandomHidariueImg } from "@/components/PMWatch/modules/ShinjukuUI"
import whatsNewData from "@/assets/whatsnew.json"
import shinjukuBanner from "@/assets/mintwatch_shinjuku_update_banner.png"

export default function Navbar({ isEditMode, setIsEditMode, isShinjukuMode, children }: { isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>>, isShinjukuMode?: boolean, children?: React.ReactNode }) {
    const setMintConfigShown = useSetMintConfigShownContext()
    const isSideMenuShown = useSideMenuShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()
    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])

    const onWhatsNewClick = useCallback(() => {
        setMintConfigShown("whatsnew")
        storage.setItem("sync:lastCheckedUpdate", whatsNewData.version)
        setIsSideMenuShown(false)
    }, [setMintConfigShown, setIsSideMenuShown])

    const hasUpdate = lastCheckedUpdate !== whatsNewData.version

    return (
        <nav className="navbar-container" id="pmw-navbar">
            <MWButton
                label="サイドメニューを切り替え"
                className="navbar-sidemenu-button"
                onClick={() => {
                    setIsSideMenuShown(!isSideMenuShown)
                }}
                data-is-active={isSideMenuShown}
                data-has-update={hasUpdate}
                data-outside-ignore="side-menu-trigger"
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
                            <div className="harajuku-header-migiue">
                                { hasUpdate
                                    ? (
                                            <button
                                                className="harajuku-header-migiue-update"
                                                title={`MintWatch を v${whatsNewData.version} へ更新しました。このバナーをクリックすると詳細情報を表示します。`}
                                                onClick={onWhatsNewClick}
                                            >
                                                <img className="harajuku-header-migiue-update-bg" src={shinjukuBanner} alt={`MintWatch を ${whatsNewData.version} へ更新しました。`} />
                                                <div className="harajuku-header-migiue-update-text">
                                                    v
                                                    {whatsNewData.version}
                                                </div>
                                            </button>
                                        )
                                    : <div className="harajuku-header-migiue-filler">MintWatch</div> }
                            </div>
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

import { useSetMintConfigShownContext, useSetSideMenuShownContext } from "../../Contexts/ModalStateProvider"
import { IconComet, IconDoorExit, IconHelpCircle, IconKeyboard, IconTool } from "@tabler/icons-react"
import { MWButton } from "../../MWButton"
import WhatsNewTitle from "./WhatsNewTitle"
import whatsNewData from "@/assets/whatsnew.json"

export default function MintToolBox({ omitKeys, quietWhatsNew }: { omitKeys?: ("vanilla" | "settings" | "whatsnew" | "help" | "shortcuts")[], quietWhatsNew?: boolean }) {
    const setMintConfigShown = useSetMintConfigShownContext()
    const setIsSideMenuShown = useSetSideMenuShownContext()

    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])

    const onWhatsNewClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("whatsnew")
        storage.setItem("sync:lastCheckedUpdate", whatsNewData.version)
        setIsSideMenuShown(false)
        e.stopPropagation()
    }, [setMintConfigShown, setIsSideMenuShown])
    const onHelpClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("help")
        setIsSideMenuShown(false)
        e.stopPropagation()
    }, [setMintConfigShown, setIsSideMenuShown])
    const onKeyboardClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("shortcuts")
        setIsSideMenuShown(false)
        e.stopPropagation()
    }, [setMintConfigShown, setIsSideMenuShown])
    const onSettingsClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("settings")
        setIsSideMenuShown(false)
        e.stopPropagation()
    }, [setMintConfigShown, setIsSideMenuShown])
    const onVanillaModeClick = useCallback(() => {
        location.href = `${location.href}${location.href.includes("?") ? "&" : "?"}nopmw=true`
    }, [])
    return (
        <div className="toolbox-container">
            {!omitKeys?.includes("vanilla") && (
                <MWButton label="元のページを表示" onClick={onVanillaModeClick} className="toolbox-button">
                    <IconDoorExit />
                </MWButton>
            )}
            {!omitKeys?.includes("settings") && (
                <MWButton label="MintWatch の設定" onClick={onSettingsClick} className="toolbox-button">
                    <IconTool />
                </MWButton>
            )}
            {!omitKeys?.includes("shortcuts") && (
                <MWButton label="キーボードショートカット" onClick={onKeyboardClick} className="toolbox-button">
                    <IconKeyboard />
                </MWButton>
            )}
            {!omitKeys?.includes("help") && (
                <MWButton label="MintWatch のはじめに" onClick={onHelpClick} className="toolbox-button">
                    <IconHelpCircle />
                </MWButton>
            )}
            {!omitKeys?.includes("whatsnew") && (
                <div className="whatsnew-wrapper">
                    <MWButton label="更新情報" onClick={onWhatsNewClick} className="toolbox-button" data-has-update={lastCheckedUpdate !== whatsNewData.version}>
                        <IconComet />
                    </MWButton>
                    {!quietWhatsNew && <WhatsNewTitle />}
                </div>
            )}
        </div>
    )
}

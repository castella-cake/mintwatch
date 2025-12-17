import { useSetMintConfigShownContext } from "../../Contexts/ModalStateProvider"
import { IconComet, IconDoorExit, IconHelpCircle, IconKeyboard, IconTool } from "@tabler/icons-react"
import WhatsNewTitle from "./WhatsNewTitle"
import whatsNewData from "@/assets/whatsnew.json"

export default function MintToolBox({ omitKeys, quietWhatsNew }: { omitKeys?: ("vanilla" | "settings" | "whatsnew" | "help" | "shortcuts")[], quietWhatsNew?: boolean }) {
    const setMintConfigShown = useSetMintConfigShownContext()

    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])

    const onWhatsNewClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("whatsnew")
        storage.setItem("sync:lastCheckedUpdate", whatsNewData.version)
        e.stopPropagation()
    }, [])
    const onHelpClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("help")
        e.stopPropagation()
    }, [])
    const onKeyboardClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("shortcuts")
        e.stopPropagation()
    }, [])
    const onSettingsClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("settings")
        e.stopPropagation()
    }, [])
    const onVanillaModeClick = useCallback(() => {
        location.href = `${location.href}${location.href.includes("?") ? "&" : "?"}nopmw=true`
    }, [])
    return (
        <div className="toolbox-container">
            {!omitKeys?.includes("vanilla") && (
                <button onClick={onVanillaModeClick} className="toolbox-button" title="元のページを表示">
                    <IconDoorExit />
                </button>
            )}
            {!omitKeys?.includes("settings") && (
                <button onClick={onSettingsClick} className="toolbox-button" title="MintWatch の設定">
                    <IconTool />
                </button>
            )}
            {!omitKeys?.includes("shortcuts") && (
                <button onClick={onKeyboardClick} className="toolbox-button" title="キーボードショートカット">
                    <IconKeyboard />
                </button>
            )}
            {!omitKeys?.includes("help") && (
                <button onClick={onHelpClick} className="toolbox-button" title="MintWatch のはじめに">
                    <IconHelpCircle />
                </button>
            )}
            {!omitKeys?.includes("whatsnew") && (
                <div className="whatsnew-wrapper">
                    <button onClick={onWhatsNewClick} className="toolbox-button" title="更新情報" data-has-update={lastCheckedUpdate !== whatsNewData.version}>
                        <IconComet />
                    </button>
                    {!quietWhatsNew && <WhatsNewTitle />}
                </div>
            )}
        </div>
    )
}

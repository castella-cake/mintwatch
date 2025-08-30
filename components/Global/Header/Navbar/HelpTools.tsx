import { useSetMintConfigShownContext } from "../../Contexts/ModalStateProvider"
import { IconComet, IconHelpCircle, IconKeyboard } from "@tabler/icons-react"
import WhatsNewTitle from "./WhatsNewTitle"

export default function HelpTools() {
    const setMintConfigShown = useSetMintConfigShownContext()
    const onWhatsNewClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("whatsnew")
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
    return (
        <div className="navbar-helptool-container">
            <button onClick={onKeyboardClick} className="navbar-helptool-button" title="キーボードショートカット">
                <IconKeyboard />
            </button>
            <button onClick={onHelpClick} className="navbar-helptool-button" title="MintWatch のはじめに">
                <IconHelpCircle />
            </button>
            <div className="whatsnew-wrapper">
                <button onClick={onWhatsNewClick} className="navbar-helptool-button" title="更新情報">
                    <IconComet />
                </button>
                <WhatsNewTitle />
            </div>
        </div>
    )
}

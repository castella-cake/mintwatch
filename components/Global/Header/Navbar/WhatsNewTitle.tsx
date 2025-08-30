import whatsNewData from "@/assets/whatsnew.json"
import { useSetMintConfigShownContext } from "../../Contexts/ModalStateProvider"

export default function WhatsNewTitle() {
    const setMintConfigShown = useSetMintConfigShownContext()
    const onClick = useCallback((e: React.MouseEvent) => {
        setMintConfigShown("whatsnew")
        e.stopPropagation()
    }, [])
    return (
        <button className="whatsnew-container" onClick={onClick}>
            <div className="whatsnew-title">更新情報</div>
            <div className="whatsnew-body">{whatsNewData.title}</div>
            <div className="whatsnew-subtitle">{whatsNewData.subtitle}</div>
        </button>
    )
}

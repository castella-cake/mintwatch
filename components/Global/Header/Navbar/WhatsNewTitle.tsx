import whatsNewData from "@/assets/whatsnew.json"
import { useSetVideoActionModalStateContext } from "../../Contexts/ModalStateProvider"
export default function WhatsNewTitle() {
    const setVideoActionModalState = useSetVideoActionModalStateContext()
    const onClick = useCallback(() => {
        setVideoActionModalState("whatsnew")
    }, [])
    return <button className="whatsnew-container" onClick={onClick}>
        <div className="whatsnew-title">更新情報</div>
        <div className="whatsnew-body">{whatsNewData.title}</div>
        <div className="whatsnew-subtitle">{whatsNewData.subtitle}</div>
    </button>
}
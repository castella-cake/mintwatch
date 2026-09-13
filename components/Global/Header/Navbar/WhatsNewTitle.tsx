import whatsNewData from "@/assets/whatsnew.json"

export default function WhatsNewTitle({ onOpen }: { onOpen?: () => void }) {
    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])
    const onClose = useCallback(() => {
        storage.setItem("sync:lastCheckedUpdate", whatsNewData.version)
    }, [])
    if (lastCheckedUpdate === whatsNewData.version) return
    return (
        <div className="whatsnew-container">
            <div className="whatsnew-body">{whatsNewData.title}</div>
            <div className="whatsnew-subtitle">{whatsNewData.subtitle}</div>
            <div className="whatsnew-actions">
                <button className="whatsnew-gotit" onClick={onClose}>OK</button>
                <button className="whatsnew-gotit" data-is-primary="true" onClick={onOpen}>更新情報を見る</button>
            </div>
        </div>
    )
}

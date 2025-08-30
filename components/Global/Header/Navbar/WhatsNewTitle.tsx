import whatsNewData from "@/assets/whatsnew.json"

export default function WhatsNewTitle() {
    const { lastCheckedUpdate } = useStorageVar(["lastCheckedUpdate"])
    const onClick = useCallback(() => {
        storage.setItem("sync:lastCheckedUpdate", whatsNewData.version)
    }, [])
    if (lastCheckedUpdate === whatsNewData.version) return
    return (
        <div className="whatsnew-container">
            <div className="whatsnew-body">{whatsNewData.title}</div>
            <div className="whatsnew-subtitle">{whatsNewData.subtitle}</div>
            <button className="whatsnew-gotit" onClick={onClick}>OK</button>
        </div>
    )
}

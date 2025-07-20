import { useViewerNgContext } from "@/components/Global/Contexts/ViewerNgProvider"
import { IconTrash } from "@tabler/icons-react"

const ngCommentsType = {
    id: "ユーザー",
    command: "コマンド",
    word: "コメント",
}

export default function NgComments() {
    const { ngData, setNgData } = useViewerNgContext()

    const [addType, setAddType] = useState<"word" | "id" | "command">("word")

    const inputRef = useRef<HTMLInputElement>(null)

    const onRemoveNgComment = useCallback(async (type: "word" | "id" | "command", source: string) => {
        const response = await deleteNgComments({ targets: [{ type, source }] })
        if (response.meta.status === 200) setNgData(response.data)
    }, [])

    const onAddNgComment = useCallback(async () => {
        if (!inputRef.current) return
        const source = inputRef.current.value.trim()
        if (!source) return
        const response = await addNgComment(addType, source)
        if (response.meta.status === 200) setNgData(response.data)
        inputRef.current.value = ""
    }, [])

    const handleAddTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAddType(e.target.value as "word" | "id" | "command")
    }, [])

    if (!ngData) return
    return (
        <div className="ngcomments-editor-container">
            <div className="videoaction-actiontitle">
                NGコメントを設定
                <br />
                <span className="videoaction-actiontitle-subtitle">
                    コメントに対するNGを追加/削除します
                </span>
            </div>
            <div className="ngcomments-editor-title">
                現在のNG一覧
            </div>
            <div className="ngcomments-editor-item-container">
                {ngData.items.map((item) => {
                    return (
                        <div key={`${item.type}-${item.source}-${item.registeredAt}`} className="ngcomments-editor-item">
                            <span className="ngcomments-type">{ngCommentsType[item.type]}</span>
                            <span>{item.source}</span>
                            <button className="ngcomments-removebutton" title="削除" onClick={() => onRemoveNgComment(item.type, item.source)}><IconTrash /></button>
                        </div>
                    )
                })}
            </div>
            <div className="ngcomments-editor-title">
                NGを追加
            </div>
            <div className="ngcomments-editor-add">
                <div className="ngcomments-editor-add-type-container">
                    <label className="ngcomments-editor-add-type-radio-label">
                        <input className="ngcomments-editor-add-type-radio" type="radio" value="word" checked={addType === "word" ? true : false} onChange={handleAddTypeChange}></input>
                        コメント
                    </label>
                    <label className="ngcomments-editor-add-type-radio-label">
                        <input className="ngcomments-editor-add-type-radio" type="radio" value="id" checked={addType === "id" ? true : false} onChange={handleAddTypeChange}></input>
                        ユーザーID
                    </label>
                    <label className="ngcomments-editor-add-type-radio-label">
                        <input className="ngcomments-editor-add-type-radio" type="radio" value="command" checked={addType === "command" ? true : false} onChange={handleAddTypeChange}></input>
                        コマンド
                    </label>
                </div>
                <input ref={inputRef} placeholder="NGを追加..." className="ngcomments-editor-add-input"></input>
                <button className="ngcomments-editor-add-button" onClick={onAddNgComment}>追加</button>
            </div>
        </div>
    )
}

import { type IAlert, useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useMylistOrderMutation, useUserMylistsCompactData } from "@/hooks/apiHooks/user/mylistOperations"
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconLock, IconWorld } from "@tabler/icons-react"
import "../../../PMWatch/styleModules/VideoActionModal/Mylists.css"
import "../../../Global/styleModules/Alert.css"
import "../../styles/MylistsReorderList.css"

type CompactMylist = UserMylistCompactDataRootObject["data"]["mylists"][number]
type ReorderSortKey = "createdAt" | "title" | "description"
type ReorderSortOption = `${ReorderSortKey}-${"asc" | "desc"}`

export function openMylistsReorderAlert(showAlert: (alert: IAlert) => void) {
    showAlert({
        title: "マイリストの並び替え",
        icon: null,
        body: <MylistsReorderList />,
        customCloseButton: [],
    })
}

function SortableMylistRow({ mylist }: { mylist: CompactMylist }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: mylist.id,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging && { pointerEvents: ("none" as React.CSSProperties["pointerEvents"]), zIndex: 1000 }),
    }

    return (
        <div
            className="mylist-item-container"
            data-is-compact="true"
            data-is-dragging={isDragging}
            data-is-sortable="true"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div className="mylist-item">
                <div className="mylist-title">
                    <span className="mylist-title-state" title={mylist.isPublic ? "公開のマイリスト" : "非公開のマイリスト"}>
                        {mylist.isPublic ? <IconWorld /> : <IconLock />}
                    </span>
                    <span className="mylist-title-name">{mylist.name}</span>
                </div>
            </div>
        </div>
    )
}

export function MylistsReorderList() {
    const { showToast, closeAlert } = useSetMessageContext()
    const { userMylistsCompactData, error, isLoading } = useUserMylistsCompactData(true)
    const orderMutation = useMylistOrderMutation()
    const [sortOption, setSortOption] = useState<ReorderSortOption | "">("")
    const [orderIds, setOrderIds] = useState<number[] | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 4 },
    }))

    const compactMylists = userMylistsCompactData?.data.mylists ?? []
    const mylistIds = orderIds ?? compactMylists.map(mylist => mylist.id)
    const mylistsById = new Map(compactMylists.map(mylist => [mylist.id, mylist]))
    const orderedMylists = mylistIds.flatMap((id) => {
        const mylist = mylistsById.get(id)
        return mylist ? [mylist] : []
    })

    const hasUncommittedChanges = orderIds !== null

    const handleApplySort = () => {
        if (sortOption === "") return
        const [sortKey, direction] = sortOption.split("-") as [ReorderSortKey, "asc" | "desc"]
        const sortedMylists = [...compactMylists].sort((a, b) => {
            let result: number
            if (sortKey === "createdAt") result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            else if (sortKey === "title") result = a.name.localeCompare(b.name)
            else result = a.description.localeCompare(b.description)
            return direction === "asc" ? result : -result
        })
        setOrderIds(sortedMylists.map(mylist => mylist.id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = mylistIds.indexOf(Number(active.id))
        const newIndex = mylistIds.indexOf(Number(over.id))
        if (oldIndex < 0 || newIndex < 0) return
        setOrderIds(arrayMove(mylistIds, oldIndex, newIndex))
    }

    const handleConfirm = async () => {
        setErrorMessage(null)
        try {
            await orderMutation.mutateAsync(mylistIds)
            showToast({ title: "並び順を更新しました" })
            closeAlert()
        } catch (error) {
            setErrorMessage(`並び順の更新に失敗しました。${String(error)}`)
        }
    }

    if (isLoading) {
        return (
            <div className="user-mylists-reorder">
                <p className="user-mylists-reorder-loading">
                    マイリストを取得中...
                </p>
                <div className="alert-buttons">
                    <button
                        type="button"
                        className="alert-button"
                        onClick={closeAlert}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-mylists-reorder">
                <p className="user-mylists-reorder-error">
                    マイリストの取得に失敗しました。
                    {String(error)}
                </p>
                <div className="alert-buttons">
                    <button
                        type="button"
                        className="alert-button"
                        onClick={closeAlert}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="user-mylists-reorder">
            <div className="user-mylists-reorder-controls">
                <span>自動並び替え</span>
                <div className="user-mylists-reorder-sortselect">
                    <select
                        value={sortOption}
                        disabled={orderMutation.isPending}
                        onChange={event => setSortOption(event.target.value as ReorderSortOption)}
                    >
                        <option value="" disabled>選択してください</option>
                        <option value="createdAt-asc">作成日が古い順</option>
                        <option value="createdAt-desc">作成日が新しい順</option>
                        <option value="title-asc">タイトル（昇順）</option>
                        <option value="title-desc">タイトル（降順）</option>
                        <option value="description-asc">説明文（昇順）</option>
                        <option value="description-desc">説明文（降順）</option>
                    </select>
                    <button
                        type="button"
                        className="user-mylists-reorder-apply"
                        disabled={sortOption === "" || orderMutation.isPending}
                        aria-disabled={sortOption === "" || orderMutation.isPending}
                        onClick={handleApplySort}
                    >
                        適用
                    </button>
                </div>
            </div>
            { errorMessage && <p className="user-mylists-reorder-error">{errorMessage}</p> }
            <div className="user-mylists-reorder-list">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={mylistIds} strategy={verticalListSortingStrategy}>
                        {orderedMylists.map(mylist => (
                            <SortableMylistRow
                                key={mylist.id}
                                mylist={mylist}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <div className="alert-buttons">
                <button
                    type="button"
                    className="alert-button"
                    onClick={closeAlert}
                    disabled={orderMutation.isPending}
                    aria-disabled={orderMutation.isPending}
                >
                    キャンセル
                </button>
                <button
                    type="button"
                    className="alert-button"
                    disabled={!hasUncommittedChanges || orderMutation.isPending}
                    aria-disabled={!hasUncommittedChanges || orderMutation.isPending}
                    data-isprimary="true"
                    onClick={handleConfirm}
                >
                    変更を保存
                </button>
            </div>
        </div>
    )
}

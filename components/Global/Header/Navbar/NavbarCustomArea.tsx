import { useDroppable } from "@dnd-kit/core"
import { NavigationObject } from "./NavigationObjects"
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconCheck, IconQuestionMark } from "@tabler/icons-react"
import { Dispatch, SetStateAction } from "react"

function SortableCustomItem({ id: itemKey, isEditMode }: { id: keyof typeof NavigationObject, isEditMode: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `navbar-${itemKey}`,
        disabled: !isEditMode,

    })
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging && { pointerEvents: ("none" as React.CSSProperties["pointerEvents"]), zIndex: 1000 }),
    }
    const item = NavigationObject[itemKey]
    return (
        <a style={style} ref={setNodeRef} {...listeners} {...attributes} aria-disabled={undefined} className="navbar-custom-area-item" href={item.href} title={item.label}>
            {item.icon ?? <IconQuestionMark />}
        </a>
    )
}

function removeDuplicatesOrdered<T>(array: T[]): T[] {
    const result = []
    const seen = new Map()

    for (const item of array) {
        if (!seen.has(item)) {
            result.push(item)
            seen.set(item, true)
        }
    }

    return result
}

export default function NavbarCustomArea({ isEditMode, setIsEditMode }: { isEditMode: boolean, setIsEditMode: Dispatch<SetStateAction<boolean>> }) {
    const { navBarCustomItemList } = useStorageVar(["navBarCustomItemList"] as const)
    const { setNodeRef } = useDroppable({
        id: "navbar-droppable",
    })
    const customItemListBase: (keyof typeof NavigationObject)[] = navBarCustomItemList ?? ["recommendations", "history", "ranking"]

    const customItemList = removeDuplicatesOrdered(customItemListBase)
    return (
        <div className="navbar-custom-area" ref={setNodeRef} data-is-editmode={isEditMode}>
            <SortableContext items={customItemList} strategy={horizontalListSortingStrategy}>
                {customItemList.map((itemKeyName, index) => {
                    return <SortableCustomItem id={itemKeyName} isEditMode={isEditMode} key={`${index}-${itemKeyName}`} />
                })}
            </SortableContext>
            {isEditMode && <button className="navbar-custom-area-edit-done-button" onClick={() => setIsEditMode(false)} title="編集を完了"><IconCheck /></button>}
            {isEditMode && (
                <div className="navbar-custom-area-editmode-tips">
                    カスタムエリアを編集中です。サイドバーから好きなアイテムをドラッグして追加できます。
                    <br />
                    既にあるアイテムを削除するには、外側にドラッグしてください。
                </div>
            )}
        </div>
    )
}

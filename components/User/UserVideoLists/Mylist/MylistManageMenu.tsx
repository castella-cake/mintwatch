import { PopupMenu } from "@/components/Global/PopupMenu"
import { ToolTip } from "@/components/Global/ToolTip"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useHistoryContext } from "@/components/Router/RouterContext"
import { useDeleteMylistMutation } from "@/hooks/apiHooks/user/mylistOperations"
import { IconAlertTriangle, IconCheck, IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { openMylistEditAlert, type MylistEditTarget } from "./MylistEditAlert"

export function MylistManageMenu({ mylist }: { mylist: MylistEditTarget }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { showAlert, showToast } = useSetMessageContext()
    const history = useHistoryContext()
    const deleteMutation = useDeleteMylistMutation()

    const handleEdit = () => {
        setIsMenuOpen(false)
        openMylistEditAlert(showAlert, mylist)
    }

    const handleDelete = () => {
        setIsMenuOpen(false)
        showAlert({
            title: "マイリストを削除",
            body: `「${mylist.name}」を削除します。この操作は元に戻せません。よろしいですか？`,
            icon: <IconAlertTriangle />,
            customCloseButton: [
                { text: "キャンセル", key: "cancel" },
                { text: "削除する", key: "confirm", primary: true },
            ],
            onClose: (key) => {
                if (key === "confirm") {
                    deleteMutation.mutate(mylist.id, {
                        onSuccess: () => {
                            showToast({ title: "マイリストを削除しました", icon: <IconCheck /> })
                            history.push("/my/mylist")
                        },
                        onError: (error) => {
                            showAlert({
                                title: "マイリストの削除に失敗しました",
                                body: String(error),
                                icon: <IconAlertTriangle />,
                            })
                        },
                    })
                }
            },
        })
    }

    return (
        <div className="user-videolist-view-menu-container">
            <ToolTip label="マイリストの操作">
                <button
                    type="button"
                    className="user-videolist-view-menubutton"
                    ref={buttonRef}
                    onClick={() => setIsMenuOpen(s => !s)}
                    data-is-active={isMenuOpen}
                    aria-label="マイリストの操作"
                >
                    <IconDotsVertical />
                </button>
            </ToolTip>
            <PopupMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} positionElemRef={buttonRef}>
                <button type="button" className="generic-contextmenu-item" onClick={handleEdit}>
                    <IconEdit />
                    <span>マイリスト情報を編集</span>
                </button>
                <button type="button" className="generic-contextmenu-item" data-is-dangerous="true" onClick={handleDelete}>
                    <IconTrash />
                    <span>マイリストを削除</span>
                </button>
            </PopupMenu>
        </div>
    )
}

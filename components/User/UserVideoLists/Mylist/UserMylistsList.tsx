import { useLocationContext } from "@/components/Router/RouterContext"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { IconArrowsUpDown, IconListNumbers, IconPlus } from "@tabler/icons-react"
import { MylistCard } from "../../GenericComponents/MylistCard"
import { openMylistCreateAlert } from "./MylistCreateAlert"
import { openMylistsReorderAlert } from "./MylistsReorderList"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function UserMylistsList({ showRootAnchor, showSampleItems, userId }: { showRootAnchor?: boolean, showSampleItems?: boolean, userId?: number }) {
    const location = useLocationContext()
    const { mylistsData } = useMylistsData(userId ?? "me", 3)
    const { showAlert } = useSetMessageContext()

    if (!mylistsData) {
        return (
            <div className="user-mylists-list user-videolists-list">
                { showSampleItems && <LoadingFiller compact /> }
            </div>
        )
    }

    // マイページのサイドエリアでのみ操作ボタンを出す
    const isSideAreaView = !!showRootAnchor && !userId

    return (
        <div className="user-mylists-list user-videolists-list">
            { isSideAreaView && (
                <div className="user-mylists-controls">
                    <button type="button" className="user-mylists-control-button" onClick={() => openMylistsReorderAlert(showAlert)}>
                        <IconArrowsUpDown />
                        並び替え
                    </button>
                    <button type="button" className="user-mylists-control-button" onClick={() => openMylistCreateAlert(showAlert)}>
                        <IconPlus />
                        新規追加
                    </button>
                </div>
            ) }
            { showRootAnchor && (
                <a
                    className="mylist-item user-videolists-item"
                    href={userId ? `/user/${userId}/mylist` : "/my/mylist"}
                    data-is-active={location.pathname === (userId ? `/user/${userId}/mylist` : "/my/mylist")}
                >
                    <div className="mylist-title user-videolists-title">
                        <span className="mylist-title-state user-videolists-title-state" title="すべてのマイリスト">
                            <IconListNumbers />
                        </span>
                        <span className="mylist-title-name user-videolists-title-name">すべてのマイリスト</span>
                    </div>
                </a>
            ) }
            { mylistsData.data.mylists.length === 0 && (
                <EmptyNotice contentName="マイリスト" />
            ) }
            {
                mylistsData.data.mylists.map((mylist) => {
                    const href = userId ? `/user/${userId}/mylist/${mylist.id}` : `/my/mylist/${mylist.id}`
                    return (
                        <MylistCard
                            key={mylist.id}
                            mylist={mylist}
                            href={href}
                            showSampleItems={showSampleItems}
                            data-is-active={location.pathname === href}
                        />
                    )
                })
            }
        </div>
    )
}

import { useLocationContext } from "@/components/Router/RouterContext"
import { useMylistsData } from "@/hooks/apiHooks/watch/mylistsData"
import { IconListNumbers } from "@tabler/icons-react"
import { MylistCard } from "../../GenericComponents/MylistCard"

export function UserMylistsList({ showRootAnchor, showSampleItems, userId }: { showRootAnchor?: boolean, showSampleItems?: boolean, userId?: number }) {
    const location = useLocationContext()
    const { mylistsData } = useMylistsData(userId ?? "me", 3)

    if (!mylistsData) {
        return (
            <div className="user-mylists-list user-videolists-list">
                <p>マイリストを取得中...</p>
            </div>
        )
    }

    return (
        <div className="user-mylists-list user-videolists-list">
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

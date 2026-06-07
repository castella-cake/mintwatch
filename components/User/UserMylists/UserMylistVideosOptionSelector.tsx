import { OptionSelector } from "@/components/Global/OptionSelector"
import { useHistoryContext, useLocationContext } from "@/components/Router/RouterContext"

const defaultSortOption = "addedAt"
const defaultOrderOption = "desc"

const sortKeys = [
    {
        label: "マイリスト登録日時",
        value: "addedAt",
    },
    {
        label: "投稿日時",
        value: "registeredAt",
    },
    {
        label: "メモ",
        value: "mylistComment",
    },
    {
        label: "再生数",
        value: "viewCount",
    },
    {
        label: "最終コメント日時",
        value: "lastCommentTime",
    },
    {
        label: "コメント数",
        value: "commentCount",
    },
    {
        label: "いいね！数",
        value: "likeCount",
    },
    {
        label: "マイリスト数",
        value: "mylistCount",
    },
    {
        label: "動画時間",
        value: "duration",
    },
]

const sortOrders = [
    {
        label: "降順",
        value: "desc",
    },
    {
        label: "昇順",
        value: "asc",
    },
]

export function UserMylistVideosOptionSelector({ children }: { children?: React.ReactNode }) {
    const { userMylistEnableGridCardLayout } = useStorageVar(["userMylistEnableGridCardLayout"], "local")
    const history = useHistoryContext()
    const location = useLocationContext()

    const pushSearchUrl = (apply: (url: URL) => void) => {
        const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
        apply(currentUrl)
        history.push(currentUrl.toString())
    }

    return (
        <OptionSelector
            order={sortOrders.map((option) => {
                const currentOption = new URLSearchParams(location.search).get("sortOrder") || defaultOrderOption
                return { ...option, active: option.value === currentOption }
            })}
            onOrderChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("sortOrder", value.toString())
                })
            }}
            sortKey={sortKeys.map((option) => {
                const currentOption = new URLSearchParams(location.search).get("sortKey") || defaultSortOption
                return { ...option, active: option.value === currentOption }
            })}
            onSortKeyChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("sortKey", value.toString())
                    const defaultOrder = "desc"
                    if (defaultOrder) currentUrl.searchParams.set("sortOrder", defaultOrder)
                })
            }}
            gridSwitcherEnabled={userMylistEnableGridCardLayout ?? false}
            onLayoutSwitch={(enabled) => {
                storage.setItem("local:userMylistEnableGridCardLayout", enabled)
            }}

            additionalClassName="user-mylist-videos-options"
        >
            {children}
        </OptionSelector>
    )
}

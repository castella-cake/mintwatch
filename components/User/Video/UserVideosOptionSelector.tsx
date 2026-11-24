import { useLocationContext, useHistoryContext } from "../../Router/RouterContext"
import { OptionSelector } from "../../Global/OptionSelector/OptionSelector"
import type { ReactNode } from "react"

interface UserVideosSortKey {
    label: string
    value: string
}

interface UserVideosOptionSelectorProps {
    children?: ReactNode
    sortKeys: UserVideosSortKey[]
    defaultSortOrder?: string
    defaultSortKey?: string
}

const fallbackSortKey = "registeredAt"
const fallbackSortOrder = "desc"

export const videoSortKeys: UserVideosSortKey[] = [
    {
        label: "投稿日時",
        value: "registeredAt",
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

export function UserVideosOptionSelector({ children, sortKeys, defaultSortKey, defaultSortOrder }: UserVideosOptionSelectorProps) {
    const { userEnableGridCardLayout } = useStorageVar(["userEnableGridCardLayout"], "local")
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
                const currentOption = new URLSearchParams(location.search).get("sortOrder") || defaultSortOrder || fallbackSortOrder
                return { ...option, active: option.value === currentOption }
            })}
            onOrderChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("sortOrder", value.toString())
                    if (sortKeys.find(k => k.value === currentUrl.searchParams.get("sortKey"))) return
                    const defaultSort = defaultSortKey || fallbackSortKey
                    if (defaultSort) currentUrl.searchParams.set("sortKey", defaultSort)
                })
            }}
            sortKey={sortKeys.map((option) => {
                const currentOption = new URLSearchParams(location.search).get("sortKey") || defaultSortKey || fallbackSortKey
                return { ...option, active: option.value === currentOption }
            })}
            onSortKeyChanged={(value) => {
                pushSearchUrl((currentUrl) => {
                    currentUrl.searchParams.set("sortKey", value.toString())
                    if (sortOrders.find(o => o.value === currentUrl.searchParams.get("sortOrder"))) return
                    const defaultOrder = defaultSortOrder || fallbackSortOrder
                    if (defaultOrder) currentUrl.searchParams.set("sortOrder", defaultOrder)
                })
            }}
            gridSwitcherEnabled={userEnableGridCardLayout ?? false}
            onLayoutSwitch={(enabled) => {
                storage.setItem("local:userEnableGridCardLayout", enabled)
            }}

            additionalClassName="user-videos-options"
        >
            {children}
        </OptionSelector>
    )
}

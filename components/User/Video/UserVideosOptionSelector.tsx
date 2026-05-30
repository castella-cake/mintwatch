import { useLocationContext, useHistoryContext } from "../../Router/RouterContext"
import { OptionSelector } from "../../Global/OptionSelector"
import type { ReactNode } from "react"

interface UserVideosOptionSelectorProps {
    children?: ReactNode
}

const defaultSortOption = "registeredAt"
const defaultOrderOption = "desc"

const sortKeys = [
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

export function UserVideosOptionSelector({ children }: UserVideosOptionSelectorProps) {
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

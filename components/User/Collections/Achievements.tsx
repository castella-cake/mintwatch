import { useId } from "react"
import { EmptyNotice } from "@/components/Global/EmptyNotice"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { useHistoryContext, useLocationContext } from "@/components/Router/RouterContext"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { useAchievedHistoryData, usePinnedAchievedHistoryData } from "@/hooks/apiHooks/user/achievedHistoryData"
import { AchievementCard } from "./AchievementCard"
import { openAchievementPinAlert } from "./AchievementPinAlert"

type AchievementOrder = "honor_class" | "achieved_at"

const validOrders: AchievementOrder[] = ["honor_class", "achieved_at"]

export function Achievements({ userId, isMyPage }: { userId: number, isMyPage: boolean }) {
    const { showAlert } = useSetMessageContext()
    const location = useLocationContext()
    const history = useHistoryContext()
    const sortSelectId = useId()

    // URLクエリパラメーター sortOrder をstateとする (不正値なら honor_class にフォールバック)
    const sortOrderParam = new URLSearchParams(location.search).get("sortOrder")
    const order: AchievementOrder = validOrders.includes(sortOrderParam as AchievementOrder) ? sortOrderParam as AchievementOrder : "honor_class"

    const { achievedHistoryData, isLoading, error } = useAchievedHistoryData(userId, order, 100, 1)
    const { pinnedAchievedHistoryData, isLoading: isPinnedLoading, error: pinnedError } = usePinnedAchievedHistoryData(userId)

    const pushSortUrl = (value: AchievementOrder) => {
        const currentUrl = new URL("https://www.nicovideo.jp" + location.pathname + location.search)
        currentUrl.searchParams.set("sortOrder", value)
        history.push(currentUrl.toString())
    }

    if (isLoading || isPinnedLoading) {
        return <LoadingFiller />
    }

    if (error) {
        return (
            <div className="user-content-error">
                <p>実績データの取得に失敗しました</p>
                <p>{String(error)}</p>
            </div>
        )
    }

    const histories = achievedHistoryData?.data.user_achieved_histories ?? []
    const pinnedItem = pinnedError || !pinnedAchievedHistoryData ? null : pinnedAchievedHistoryData.data.user_achieved_history

    const handleOpenPinAlert = () => {
        openAchievementPinAlert(showAlert, {
            userId,
            histories,
            currentPinnedId: pinnedItem?.id ?? null,
        })
    }

    return (
        <div className="user-history-content user-category-content">
            {pinnedItem && (
                <div className="achievement-pinned-container" data-pinned>
                    <div className="achievement-pinned-header">
                        <h2 className="achievement-section-title">代表実績</h2>
                        {isMyPage && (
                            <button
                                type="button"
                                className="achievement-settings-button"
                                onClick={handleOpenPinAlert}
                            >
                                実績の設定
                            </button>
                        )}
                    </div>
                    <AchievementCard item={pinnedItem} />
                </div>
            )}
            <div className="achievement-list-container">
                <div className="achievement-list-header">
                    <select
                        id={sortSelectId}
                        className="achievement-sort-select"
                        value={order}
                        onChange={(event) => { pushSortUrl(event.target.value as AchievementOrder) }}
                    >
                        <option value="honor_class">実績クラスが高い順</option>
                        <option value="achieved_at">獲得日時が新しい順</option>
                    </select>
                </div>
                <div className="achievement-items">
                    {histories.length === 0 && <EmptyNotice contentName="実績" />}
                    {histories.map(history => (
                        <AchievementCard key={history.id} item={history} />
                    ))}
                </div>
            </div>
        </div>
    )
}

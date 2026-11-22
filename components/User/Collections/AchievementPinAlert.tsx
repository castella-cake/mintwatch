import { useSetMessageContext, type IAlert } from "@/components/Global/Contexts/MessageProvider"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { usePinAchievedHistoryMutation } from "@/hooks/apiHooks/user/achievedHistoryData"
import { honorClassConfig, formatAchievedDate } from "../GenericComponents/achievementConfig"
import "../../Global/styleModules/Alert.css"

export function openAchievementPinAlert(showAlert: (alert: IAlert) => void, {
    userId,
    histories,
    currentPinnedId,
}: {
    userId: number
    histories: AchievedHistoryItem[]
    currentPinnedId: number | null
}) {
    showAlert({
        title: "代表実績を設定",
        icon: null,
        body: <AchievementPinForm userId={userId} histories={histories} currentPinnedId={currentPinnedId} />,
        customCloseButton: [],
    })
}

function AchievementPinForm({ userId, histories, currentPinnedId }: {
    userId: number
    histories: AchievedHistoryItem[]
    currentPinnedId: number | null
}) {
    const { showToast, closeAlert } = useSetMessageContext()
    const pinMutation = usePinAchievedHistoryMutation(userId)
    const [selectedId, setSelectedId] = useState<number | null>(currentPinnedId)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const isSubmitDisabled = selectedId === null || pinMutation.isPending

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault()
        if (selectedId === null) return

        setErrorMessage(null)
        try {
            await pinMutation.mutateAsync(selectedId)
            showToast({ title: "代表実績を設定しました" })
            closeAlert()
        } catch (error) {
            setErrorMessage(`代表実績の設定に失敗しました。${String(error)}`)
        }
    }

    return (
        <form className="achievement-pin-form" onSubmit={handleSubmit}>
            <div className="achievement-pin-content">
                {histories.length === 0 && !pinMutation.isPending && (
                    <p className="achievement-pin-empty">設定できる実績がありません</p>
                )}
                {histories.map((item) => {
                    const config = honorClassConfig[item.achievement.honor_class]
                    const Icon = config.icon
                    return (
                        <label
                            key={item.id}
                            className="achievement-pin-item"
                            data-is-selected={selectedId === item.id}
                            data-honor-class={item.achievement.honor_class}
                        >
                            <input
                                type="radio"
                                name="achievement-pin"
                                checked={selectedId === item.id}
                                onChange={() => setSelectedId(item.id)}
                            />
                            <span className="achievement-pin-item-icon">
                                <Icon aria-hidden="true" />
                            </span>
                            <span className="achievement-pin-item-name">{item.achievement.name}</span>
                            <span className="achievement-pin-item-date">{formatAchievedDate(item.achieved_at)}</span>
                        </label>
                    )
                })}
                {pinMutation.isPending && <LoadingFiller compact />}
            </div>
            {errorMessage && <p className="achievement-pin-error">{errorMessage}</p>}
            <div className="alert-buttons">
                <button
                    type="button"
                    className="alert-button"
                    onClick={closeAlert}
                    disabled={pinMutation.isPending}
                    aria-disabled={pinMutation.isPending}
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    className="alert-button"
                    disabled={isSubmitDisabled}
                    aria-disabled={isSubmitDisabled}
                    data-isprimary="true"
                >
                    設定
                </button>
            </div>
        </form>
    )
}

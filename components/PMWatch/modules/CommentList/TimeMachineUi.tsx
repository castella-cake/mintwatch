import { useState, useMemo } from "react"

export function TimeMachine({ onConfirm, onReload }: { onConfirm: (dateTime: Date) => void, onReload: () => void }) {
    const [dateInput, setDateInput] = useState("")
    const [timeInput, setTimeInput] = useState("")

    const isInvalidDateTime = useMemo(() => {
        if (!dateInput || !timeInput) return true

        const [year, month, day] = dateInput.split("-").map(Number)
        const [hours, minutes] = timeInput.split(":").map(Number)
        const selectedDate = new Date(year, month - 1, day, hours, minutes)
        const now = new Date()

        return selectedDate > now
    }, [dateInput, timeInput])

    function onClick() {
        if (isInvalidDateTime) return

        const [year, month, day] = dateInput.split("-").map(Number)
        const [hours, minutes] = timeInput.split(":").map(Number)

        const selectedDate = new Date(year, month - 1, day, hours, minutes)
        onConfirm(selectedDate)
    }

    return (
        <div className="comment-timemachine-container">
            <div className="comment-timemachine-title global-flex">
                <div className="global-flex1">過去ログローダー</div>
                <button
                    className="comment-timemachine-reload"
                    onClick={onReload}
                >
                    現代に戻って再読み込み
                </button>
            </div>

            <div className="comment-timemachine-content">
                <div className="comment-timemachine-input-container">
                    <input
                        type="date"
                        value={dateInput}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={e => setDateInput(e.target.value)}
                    />
                </div>
                <div className="comment-timemachine-input-container">
                    <input
                        type="time"
                        value={timeInput}
                        onChange={e => setTimeInput(e.target.value)}
                    />
                </div>

                <button
                    onClick={onClick}
                    aria-disabled={isInvalidDateTime}
                    className="comment-timemachine-confirm"
                >
                    読み込む
                </button>
            </div>
            <div className="comment-timemachine-description">
                新しいコメントを投稿すると、ロードした過去ログは破棄されます。
            </div>
        </div>
    )
}

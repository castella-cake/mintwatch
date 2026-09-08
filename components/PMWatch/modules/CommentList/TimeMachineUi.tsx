import { useState, useMemo, useId, useEffect } from "react"
import { IconCopy } from "@tabler/icons-react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"

export function TimeMachine({
    currentLogData,
    smId,
    onConfirm,
    onReload,
}: {
    currentLogData?: { when: number }
    smId: string | null
    onConfirm: (dateTime: Date) => void
    onReload: () => void
}) {
    const elementId = useId()
    const { showToast } = useSetMessageContext()

    const [dateInput, setDateInput] = useState("")
    const [timeInput, setTimeInput] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (currentLogData) {
            const date = new Date(currentLogData.when * 1000)
            setDateInput(formatDateForInput(date))
            setTimeInput(formatTimeForInput(date))
        }
    }, [currentLogData])

    const currentLogDate = useMemo(() => {
        if (!currentLogData) return null
        return new Date(currentLogData.when * 1000)
    }, [currentLogData])

    const pastLogUrl = useMemo(() => {
        if (!currentLogData || !smId) return ""
        return `${window.location.origin}/watch/${smId}?past_log=${currentLogData.when}`
    }, [currentLogData, smId])

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

    function handleCopyUrl() {
        if (!pastLogUrl) return
        navigator.clipboard.writeText(pastLogUrl).then(() => {
            setCopied(true)
            showToast({
                title: "過去ログURLをコピーしました",
                body: "このURLから過去ログを読み込むには対応したプレイヤーが必要です。",
            })
            setTimeout(() => setCopied(false), 5000)
        })
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
                        id={`${elementId}-dateinput`}
                    />
                </div>
                <div className="comment-timemachine-input-container">
                    <input
                        type="time"
                        value={timeInput}
                        onChange={e => setTimeInput(e.target.value)}
                        id={`${elementId}-timeinput`}
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
            {currentLogDate && (
                <div
                    className="comment-timemachine-currentindicator"
                    data-haslog="true"
                >
                    {formatDateTimeForDisplay(currentLogDate)}
                    {" "}
                    時点の過去ログを表示中
                </div>
            )}
            <div className="comment-timemachine-description">
                コメント投稿などの操作を行うと、過去ログは解除されます。
            </div>
            {currentLogDate && smId && (
                <div className="comment-timemachine-copyrow">
                    <button
                        onClick={handleCopyUrl}
                        aria-disabled={!pastLogUrl}
                        className="comment-timemachine-copyurl"
                    >
                        <IconCopy />
                        {copied ? "コピーしました" : "URLをコピー"}
                    </button>
                    <span className="comment-timemachine-copyhint">
                        対応したプレイヤーが必要です。
                    </span>
                </div>
            )}
        </div>
    )
}

function formatDateForInput(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

function formatTimeForInput(date: Date): string {
    const h = String(date.getHours()).padStart(2, "0")
    const min = String(date.getMinutes()).padStart(2, "0")
    return `${h}:${min}`
}

function formatDateTimeForDisplay(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    const h = String(date.getHours()).padStart(2, "0")
    const min = String(date.getMinutes()).padStart(2, "0")
    return `${y}/${m}/${d} ${h}:${min}`
}

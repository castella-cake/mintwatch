import { IconBulb, IconX } from "@tabler/icons-react"
import { ReactNode, useState } from "react"
import "./styleModules/featureTips.css"

type FeatureTipsProps = {
    tipId: string
    settingKey?: string
    actionLabel?: string
    onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void
    children: ReactNode
}

const EMPTY_SETTING_KEYS = [] as const

export function FeatureTips({ tipId, settingKey, actionLabel, onAction, children }: FeatureTipsProps) {
    const [isClosed, setIsClosed] = useState(false)
    const { ignoredTips } = useStorageVar(["ignoredTips"] as const, "local")
    const syncSetting = useStorageVar(settingKey ? [settingKey] as const : EMPTY_SETTING_KEYS, "sync")

    if (isClosed) return null
    if (settingKey && syncSetting[settingKey]) return null
    if (Array.isArray(ignoredTips) && ignoredTips.includes(tipId)) return null

    function handleClose() {
        const current = Array.isArray(ignoredTips) ? ignoredTips : []
        if (!current.includes(tipId)) {
            storage.setItem("local:ignoredTips", [...current, tipId])
        }
        setIsClosed(true)
    }

    return (
        <div className="featuretips-container" data-visible="true">
            <span className="featuretips-icon" aria-hidden>
                <IconBulb />
            </span>
            <span className="featuretips-text">{children}</span>
            {actionLabel && onAction && (
                <button
                    className="featuretips-action"
                    type="button"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
            <button
                className="featuretips-close"
                type="button"
                onClick={handleClose}
                aria-label="ヒントを閉じる"
            >
                <IconX />
            </button>
        </div>
    )
}

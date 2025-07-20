import { ReactNode, useCallback } from "react"
import { useHistoryContext } from "./RouterContext"

export function HistoryAnchor({ href, beforePush, children, title, className, disabled = false, ...additionalAttributes }: { href?: string, beforePush?: () => void, children: ReactNode, className: string, title?: string, disabled?: boolean }) {
    const history = useHistoryContext()
    const onAnchorClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        if (beforePush) beforePush()
        if (href && !disabled) history.push(href)
    }, [href, beforePush])
    return (
        <a href={href || "#"} title={title || undefined} onClick={onAnchorClick} aria-disabled={disabled} className={className} {...additionalAttributes}>
            {children}
        </a>
    )
}

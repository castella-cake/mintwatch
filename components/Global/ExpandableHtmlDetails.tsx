import DOMPurify from "dompurify"
import HTMLReactParser from "html-react-parser"
import { MouseEvent, SyntheticEvent, useState } from "react"

function htmlToText(htmlString: string) {
    const dummyDiv = document.createElement("div")
    dummyDiv.innerHTML = htmlString
    return dummyDiv.textContent || dummyDiv.innerText || ""
}

type ExpandableHtmlDetailsProps = {
    html: string
    summaryLabel: string
    className?: string
    contentClassName?: string
    showPreviewAsClosedSummary?: boolean
    open?: boolean
    onToggle?: (open: boolean) => void
    onContentClick?: (e: MouseEvent<HTMLDivElement>) => void
}

export function ExpandableHtmlDetails({
    html,
    summaryLabel,
    className,
    contentClassName,
    showPreviewAsClosedSummary,
    open: controlledOpen,
    onToggle: controlledOnToggle,
    onContentClick,
}: ExpandableHtmlDetailsProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const sanitized = DOMPurify.sanitize(html || "")
    const parsed = HTMLReactParser(sanitized)
    const previewText = htmlToText(sanitized)

    const handleToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
        const nextOpen = e.currentTarget.open
        if (!isControlled) {
            setInternalOpen(nextOpen)
        }
        controlledOnToggle?.(nextOpen)
    }

    return (
        <details
            className={className}
            open={open}
            onToggle={handleToggle}
        >
            <summary>
                {(!showPreviewAsClosedSummary || open) && summaryLabel}
                {!open && previewText && <span>{previewText}</span>}
            </summary>
            <div
                className={contentClassName}
                onClickCapture={onContentClick}
            >
                {parsed}
            </div>
        </details>
    )
}

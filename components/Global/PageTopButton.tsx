import "./styleModules/PageTopButton.css"
import { IconChevronUp } from "@tabler/icons-react"

type PageTopButtonProps = {
    isLabelShown?: boolean
    isFixed?: boolean
}

export function PageTopButton({ isLabelShown = false, isFixed = true }: PageTopButtonProps) {
    return (
        <button
            className="pagetop-button"
            data-is-fixed={isFixed}
            data-is-label-shown={isLabelShown}
            onClick={() => {
                window.scroll({ top: 0, behavior: "smooth" })
            }}
        >
            <IconChevronUp />
            {isLabelShown && <span>PAGE TOP</span>}
        </button>
    )
}

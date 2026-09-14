import { ToolTip } from "./ToolTip"

type MWButtonProps = {
    label: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function MWButton({ label, children, disabled, ...buttonProps }: MWButtonProps) {
    return (
        <ToolTip label={label}>
            <button aria-label={label} disabled={disabled} {...buttonProps}>
                {children}
            </button>
        </ToolTip>
    )
}

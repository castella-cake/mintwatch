import { memo } from "react"
import type { MouseEventHandler, ReactNode } from "react"
import { MWButton } from "@/components/Global/MWButton"

type PlayerControllerButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>
    title: string
    className: string
    children: ReactNode
}

export const PlayerControllerButton = memo(function PlayerControllerButton({ onClick, title, className, children }: PlayerControllerButtonProps) {
    return (
        <MWButton label={title} className={className} onClick={onClick}>
            {children}
        </MWButton>
    )
})

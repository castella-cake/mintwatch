import { ReactNode } from "react"
import { MWButton } from "@/components/Global/MWButton"

export const PlayerControllerButton = ({ onClick, title, className, children }: { onClick: any, title: string, className: string, children: ReactNode }) => {
    return (
        <MWButton label={title} className={className} onClick={onClick}>
            {children}
        </MWButton>
    )
}

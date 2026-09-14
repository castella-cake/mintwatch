import { memo, useCallback } from "react"
import type { Dispatch, SetStateAction } from "react"
import { IconMessage2, IconMessage2Off } from "@tabler/icons-react"
import ShinjukuCommentShown from "@/assets/shinjuku/CommentShown.svg?react"
import ShinjukuCommentHidden from "@/assets/shinjuku/CommentHidden.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type CommentToggleButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    isCommentShown: boolean
    setIsCommentShown: Dispatch<SetStateAction<boolean>>
}

/**
 * コメント表示切替ボタン
 * isCommentShown が変化したときのみ再レンダリングされる
 */
export const CommentToggleButton = memo(function CommentToggleButton({ currentPlayerType, isCommentShown, setIsCommentShown }: CommentToggleButtonProps) {
    const onClick = useCallback(() => {
        setIsCommentShown(!isCommentShown)
    }, [isCommentShown, setIsCommentShown])

    return (
        <PlayerControllerButton
            className="playercontroller-commenttoggle"
            onClick={onClick}
            title={isCommentShown ? "コメントを非表示" : "コメントを表示"}
        >
            {currentPlayerType === playerTypes.shinjuku
                ? (isCommentShown ? <ShinjukuCommentShown /> : <ShinjukuCommentHidden />)
                : (isCommentShown ? <IconMessage2 /> : <IconMessage2Off />)}
        </PlayerControllerButton>
    )
})

import { memo, useCallback, useMemo } from "react"
import type { Dispatch, SetStateAction } from "react"
import { IconAdjustments, IconAdjustmentsCheck, IconAdjustmentsFilled } from "@tabler/icons-react"
import ShinjukuOpenVefx from "@/assets/shinjuku/OpenVEFX.svg?react"
import type { effectsState } from "@/hooks/eqHooks"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type VefxToggleButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    isVefxShown: boolean
    setIsVefxShown: Dispatch<SetStateAction<boolean>>
    effectsState: effectsState
}

/**
 * エフェクト設定パネルの開閉ボタン
 * isVefxShown / effectsState が変化したときのみ再レンダリングされる
 */
export const VefxToggleButton = memo(function VefxToggleButton({ currentPlayerType, isVefxShown, setIsVefxShown, effectsState }: VefxToggleButtonProps) {
    const enabledEffects = useMemo(() => {
        return Object.keys(effectsState).map((elem) => {
            if (elem && effectsState[elem as keyof effectsState].enabled) return elem
            return
        }).filter((elem) => { if (elem) return true })
    }, [effectsState])

    const onClick = useCallback(() => {
        setIsVefxShown(!isVefxShown)
    }, [isVefxShown, setIsVefxShown])

    return (
        <PlayerControllerButton
            className="playercontroller-effectchange"
            onClick={onClick}
            title="エフェクト設定"
        >
            {currentPlayerType === playerTypes.shinjuku
                ? <ShinjukuOpenVefx />
                : (isVefxShown
                        ? <IconAdjustmentsFilled />
                        : (enabledEffects.length > 0) ? <IconAdjustmentsCheck /> : <IconAdjustments />
                    )}
        </PlayerControllerButton>
    )
})

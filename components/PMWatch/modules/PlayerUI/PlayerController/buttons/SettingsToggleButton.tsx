import { memo, useCallback } from "react"
import type { Dispatch, SetStateAction } from "react"
import { IconSettings, IconSettingsFilled } from "@tabler/icons-react"
import ShinjukuOpenSettings from "@/assets/shinjuku/OpenSettings.svg?react"
import { PlayerControllerButton } from "../Button"
import { playerTypes } from "../../PlayerController"

type SettingsToggleButtonProps = {
    currentPlayerType: keyof typeof playerTypes
    isSettingsShown: boolean
    setIsSettingsShown: Dispatch<SetStateAction<boolean>>
}

/**
 * プレイヤー設定パネルの開閉ボタン
 * isSettingsShown が変化したときのみ再レンダリングされる
 */
export const SettingsToggleButton = memo(function SettingsToggleButton({ currentPlayerType, isSettingsShown, setIsSettingsShown }: SettingsToggleButtonProps) {
    const onClick = useCallback(() => {
        setIsSettingsShown(!isSettingsShown)
    }, [isSettingsShown, setIsSettingsShown])

    return (
        <PlayerControllerButton
            className="playercontroller-settings"
            onClick={onClick}
            title="プレイヤーの設定"
        >
            {currentPlayerType === playerTypes.shinjuku
                ? <ShinjukuOpenSettings />
                : (isSettingsShown ? <IconSettingsFilled /> : <IconSettings />)}
        </PlayerControllerButton>
    )
})

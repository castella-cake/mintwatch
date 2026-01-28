import { useId } from "react"

export default function Checkbox({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const elementId = useId()
    const settingStorage = useStorageVar([settingKey], "local")
    return (
        <label>
            <input
                id={elementId}
                type="checkbox"
                checked={settingStorage[settingKey] ?? setting.defaultValue}
                onChange={(e) => { storage.setItem(`local:${settingKey}`, e.currentTarget.checked) }}
            />
            {setting.name}
        </label>
    )
}

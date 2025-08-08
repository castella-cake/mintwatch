export default function Checkbox({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const settingStorage = useStorageVar([settingKey], "local")
    return (
        <label>
            <input type="checkbox" checked={settingStorage[settingKey] ?? setting.defaultValue} onChange={(e) => { storage.setItem(`local:${settingKey}`, e.currentTarget.checked) }} />
            {setting.name}
        </label>
    )
}

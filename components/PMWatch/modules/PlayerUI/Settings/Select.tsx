export default function Select({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const settingStorage = useStorageVar([settingKey], "local")
    return (
        <label>
            {setting.name}
            <select value={settingStorage[settingKey] || setting.defaultValue} onChange={(e) => { storage.setItem(`local:${settingKey}`, e.currentTarget.value) }}>
                {setting.options && setting.options.map((option, index) => {
                    return <option value={option} key={`${settingKey}-${index}`}>{setting.texts && setting.texts[index]}</option>
                })}
            </select>
        </label>
    )
}

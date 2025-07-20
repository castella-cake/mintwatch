export default function Select({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const { localStorage, setLocalStorageValue } = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }
    return (
        <label>
            {setting.name}
            <select value={localStorage.playersettings[settingKey] || setting.defaultValue} onChange={(e) => { writePlayerSettings(settingKey, e.currentTarget.value) }}>
                {setting.options && setting.options.map((option, index) => {
                    return <option value={option} key={`${settingKey}-${index}`}>{setting.texts && setting.texts[index]}</option>
                })}
            </select>
        </label>
    )
}

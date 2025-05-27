export default function Checkbox({ settingKey, setting }: { settingKey: string, setting: PlayerSetting })  {
    const {localStorage, setLocalStorageValue} = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }
    return <label>
        <input type="checkbox" checked={localStorage.playersettings[settingKey] ?? setting.defaultValue} onChange={(e) => {writePlayerSettings(settingKey, e.currentTarget.checked)}}/>
        {setting.name}
    </label>
}
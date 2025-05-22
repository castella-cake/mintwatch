import { playerSettings, toFlatPlayerSettings } from "@/utils/playerSettingList";

export default function SettingRow({ settingKey }: { settingKey: string }) {
    const {localStorage, setLocalStorageValue} = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }
    const setting = toFlatPlayerSettings(playerSettings)[settingKey]
    if ( setting.type === "select" ) {
        return <div className="playersettings-item">
            <label>
                {setting.name}
                <select value={localStorage.playersettings[settingKey] || setting.defaultValue} onChange={(e) => {writePlayerSettings(settingKey, e.currentTarget.value)}}>
                    {setting.options && setting.options.map((option, index) => {
                        return <option value={option} key={`${settingKey}-${index}`}>{setting.texts && setting.texts[index]}</option>
                    })}
                </select>
            </label>
            { setting.hint && <div className="playersettings-hint">{setting.hint}</div> }
        </div>
    } else if ( setting.type === "checkbox" ) {
        return <div className="playersettings-item">
            <label>
                <input type="checkbox" checked={localStorage.playersettings[settingKey] ?? setting.defaultValue} onChange={(e) => {writePlayerSettings(settingKey, e.currentTarget.checked)}}/>
                {setting.name}
            </label>
            { setting.hint && <div className="playersettings-hint">{setting.hint}</div> }
        </div>
    }
}
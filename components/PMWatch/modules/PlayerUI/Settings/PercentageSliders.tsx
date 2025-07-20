export default function PercentageSliders({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const { localStorage, setLocalStorageValue } = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }

    // 地獄？
    const [percentages, setPercentages] = useState<{ [key: string]: number }>(Object.keys(setting.sliders ?? {}).reduce((prev, key) => ({ ...prev, [key]: (localStorage.playersettings[settingKey] && localStorage.playersettings[settingKey][key]) ?? 1 }), {}))

    const sliderRefs = useRef<{ [key: string]: HTMLInputElement }>({})

    const handleSliderApply = () => {
        writePlayerSettings(settingKey, percentages)
    }

    if (!setting.sliders) return
    return (
        <>
            {Object.keys(setting.sliders).map((key) => {
                const currentValue = (localStorage.playersettings[settingKey] && localStorage.playersettings[settingKey][key]) ?? 1
                return (
                    <div key={key} className="playersettings-slider">
                        <label className="global-flex">
                            {setting.sliders![key].name}
                            {" "}
                            <span>
                                {Math.floor(percentages[key] * 100)}
                                %
                            </span>
                        </label>
                        <input
                            type="range"
                            min={setting.sliders![key].min}
                            max={setting.sliders![key].max}
                            step={setting.sliders![key].step}
                            defaultValue={currentValue}
                            onChange={(e) => {
                                setPercentages({ ...percentages, [key]: Number(e.currentTarget.value) })
                            }}
                            ref={(elem) => { sliderRefs.current[key] = elem! }}
                        />
                    </div>
                )
            })}
            <button onClick={handleSliderApply}>適用</button>
        </>
    )
}

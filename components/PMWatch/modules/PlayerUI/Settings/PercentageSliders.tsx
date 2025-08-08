export default function PercentageSliders({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    const settingStorage = useStorageVar([settingKey], "local")

    // 地獄？
    const [percentages, setPercentages] = useState<{ [key: string]: number }>(Object.keys(setting.sliders ?? {}).reduce((prev, key) => ({ ...prev, [key]: (settingStorage[settingKey] && settingStorage[settingKey][key]) ?? 1 }), {}))

    // need better solution
    useEffect(() => {
        if (settingStorage[settingKey]) setPercentages(settingStorage[settingKey])
    }, [settingStorage]) // there is only settingsKey in storage, so we don't need to watch specific key

    const sliderRefs = useRef<{ [key: string]: HTMLInputElement }>({})

    const handleSliderApply = () => {
        storage.setItem(`local:${settingKey}`, percentages)
    }

    if (!setting.sliders) return
    return (
        <>
            {Object.keys(setting.sliders).map((key) => {
                const currentValue = percentages[key] ?? 1
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
                            value={currentValue}
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

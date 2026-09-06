import { categoryUnlockFlags, setting, settingList } from "../../utils/settingsList"
import { useLang } from "@/hooks/localizeHook"
import { useStorageVar } from "@/hooks/extensionHook"
import { useId } from "react"

function CreateSettingsControl({ setting }: { setting: setting }) {
    // console.log(lang.SETTINGS_ITEMS[settings.name].name)
    const lang: any = useLang()
    const syncStorage = useStorageVar([setting.name])
    const thisElementId = useId()

    const settingName = setting.name as keyof typeof lang.SETTINGS_ITEMS
    const langItem = lang.SETTINGS_ITEMS[settingName]
    if (setting.type === "checkbox") {
        return (
            <label>
                <input id={thisElementId} type="checkbox" checked={syncStorage[setting.name] ?? setting.default} onChange={(e) => { storage.setItem(`sync:${setting.name}`, e.currentTarget.checked) }} />
                {langItem?.name ?? setting.name}
            </label>
        )
    } else if (setting.type === "select" && setting.values) {
        const settingsOption = setting.values.map((elem, index) => {
            return <option value={elem} key={elem}>{langItem?.select?.[index] ?? elem}</option>
        })
        return (
            <label>
                {langItem?.name ?? setting.name}
                <select id={thisElementId} onChange={(e) => { storage.setItem(`sync:${setting.name}`, e.currentTarget.value) }} value={syncStorage[setting.name] ?? setting.default}>{ settingsOption }</select>
            </label>
        )
    } else if (setting.type === "selectButtons" && setting.values) {
        const settingsOption = setting.values.map((elem, index) => {
            return (
                <button
                    type="button"
                    key={elem}
                    onClick={() => { storage.setItem(`sync:${setting.name}`, elem) }}
                    className={"select-button" + ((syncStorage[setting.name] ?? setting.default) == elem ? " select-button-current" : "")}
                >
                    {langItem?.select?.[index] ?? elem}
                </button>
            )
        })
        return (
            <label>
                {langItem?.name ?? setting.name}
                <div className="select-button-container" key={`${setting.name}-selectbutton`}>{ settingsOption }</div>
            </label>
        )
    } else if (setting.type === "inputNumber") {
        return (
            <label>
                {langItem?.name ?? setting.name}
                <input id={thisElementId} type="number" min={setting.min} max={setting.max} value={(syncStorage[setting.name] ?? setting.default)} onChange={(e) => { storage.setItem(`sync:${setting.name}`, Number(e.currentTarget.value)) }} />
            </label>
        )
    } else if (setting.type === "inputString") {
        // console.log(syncStorage[settings.name])
        return (
            <label>
                {langItem?.name ?? setting.name}
                <input id={thisElementId} type="text" value={(syncStorage[setting.name] ?? setting.default)} placeholder={langItem?.placeholder ?? (setting.placeholder ?? null)} onChange={(e) => { storage.setItem(`sync:${setting.name}`, e.currentTarget.value) }} />
            </label>
        )
    } else if (setting.type === "desc") {
        return (
            <div className="desc">
                {langItem?.name ?? setting.name}
                {setting.href && <a href={setting.href} target="_blank" rel="noreferrer">{langItem?.linktitle ?? "LINK"}</a>}
            </div>
        )
    } else if (setting.type === "group") {
        return (
            <details className="settings-group">
                <summary>{langItem?.name ?? setting.name}</summary>
                {setting.children && setting.children.map((elem) => {
                    return <CreateSettingsRow setting={elem} key={`${elem.name}-group-children`} />
                })}
            </details>
        )
    } else {
        return <label>Unknown settings type</label>
    }
}

function LinkElem({ setting }: { setting: setting }) {
    const lang = useLang()
    if (setting.settingLink) {
        const settingsLink = lang[setting.settingLink.name as keyof typeof lang] as string
        return <a target="_self" className="settinglink" href={setting.settingLink.href}>{settingsLink ?? setting.settingLink.name}</a>
    } else {
        return <></>
    }
}
function HintElem({ setting }: { setting: setting }) {
    const lang: any = useLang()
    const hint = lang.SETTINGS_ITEMS[setting.name]?.hint
    if (hint && hint !== "") {
        return <div className="hint">{hint}</div>
    } else {
        return <></>
    }
}

function CreateSettingsRow({ setting }: { setting: setting }) {
    // console.log(syncStorage[settings.name])
    const syncStorage = useStorageVar(setting.unlockFlag ? [setting.unlockFlag] : [])
    if (setting.unlockFlag && !syncStorage[setting.unlockFlag]) return

    let elemList = [<CreateSettingsControl setting={setting} key={setting.name} />]
    if (setting.children && setting.type !== "group") {
        // console.log(settings.children)
        const childrenSettingsElemList = setting.children.map((elem) => {
            return <CreateSettingsControl setting={elem} key={setting.name} />
        })
        // console.log(childrenSettingsElemList)
        elemList = [...elemList, ...childrenSettingsElemList]
    }
    return (
        <div className="settings-row">
            { elemList }
            <HintElem setting={setting} />
            <LinkElem setting={setting} />
        </div>
    )
}

function CreateSettingsArea({ categoryName, settings }: { categoryName: string, settings: setting[] }) {
    const lang: any = useLang()
    const unlockFlag = categoryUnlockFlags[categoryName]
    const syncStorage = useStorageVar(unlockFlag ? [unlockFlag] : [])
    if (unlockFlag && !syncStorage[unlockFlag]) return

    const settingsAreaElems = settings.map((settingsElem) => {
        return <CreateSettingsRow setting={settingsElem} key={`${settingsElem.name}-row`} />
    })
    return (
        <div className="settings-area" id={categoryName}>
            <h1>{lang.SETTINGS_AREATITLE[categoryName] ?? categoryName}</h1>
            {settingsAreaElems}
        </div>
    )
}

function CreateSettingsList({ settings }: { settings: settingList }) {
    const elemArray = Object.keys(settings).map((elem) => {
        return <CreateSettingsArea categoryName={elem} settings={settings[elem]} key={`${elem}-area`} />
    })
    // console.log(elemArray)
    return (
        <>
            { elemArray }
        </>
    )
}

export default CreateSettingsList

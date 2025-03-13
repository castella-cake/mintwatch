import { setting, settingList } from "../../utils/settingsList";
import { useStorageContext } from "@/hooks/extensionHook";
import { useLang } from "@/hooks/localizeHook";

function CreateSettingsControl({ setting }: { setting: setting }) {
    //console.log(lang.SETTINGS_ITEMS[settings.name].name)
    const lang: any = useLang()
    const { syncStorage, setSyncStorageValue } = useStorageContext()

    if ( !setting ) return

    const settingName = setting.name as keyof typeof lang.SETTINGS_ITEMS
    if ( setting.type === "checkbox" ) {
        return <label ><input type="checkbox" checked={syncStorage[setting.name] ?? setting.default} onChange={(e) => {setSyncStorageValue(setting.name, e.currentTarget.checked)}} />{lang.SETTINGS_ITEMS[settingName].name ?? setting.name}</label>
    } else if ( setting.type === "select" && setting.values ){
        const settingsOption = setting.values.map((elem, index) => { return <option value={elem} key={elem}>{lang.SETTINGS_ITEMS[settingName].select[index] ?? elem}</option> })
        return <label >{lang.SETTINGS_ITEMS[settingName].name ?? setting.name}<select onChange={(e) => {setSyncStorageValue(setting.name, e.currentTarget.value)}} value={syncStorage[setting.name] ?? setting.default}>{ settingsOption }</select></label>
    } else if ( setting.type === "selectButtons" && setting.values ){
        const settingsOption = setting.values.map((elem, index) => { return <button type="button" key={elem} onClick={() => {setSyncStorageValue(setting.name, elem)}} className={"select-button" + ((syncStorage[setting.name] ?? setting.default) == elem ? " select-button-current" : "")}>{lang.SETTINGS_ITEMS[settingName].select[index] ?? elem}</button> })
        return <><label >{lang.SETTINGS_ITEMS[settingName].name ?? setting.name}</label><div className="select-button-container" key={`${setting.name}-selectbutton`}>{ settingsOption }</div></>
    } else if ( setting.type === "inputNumber" ) {
        return <label >{lang.SETTINGS_ITEMS[settingName].name ?? setting.name}<input type="number" min={setting.min} max={setting.max} value={(syncStorage[setting.name] ?? setting.default)} onChange={(e) => {setSyncStorageValue(setting.name, e.currentTarget.value)}}/></label>
    } else if ( setting.type === "inputString" ) {
        //console.log(syncStorage[settings.name])
        return <label >{lang.SETTINGS_ITEMS[settingName].name ?? setting.name}<input type="text" value={(syncStorage[setting.name] ?? setting.default)} placeholder={lang.SETTINGS_ITEMS[settingName].placeholder ?? (setting.placeholder ?? null)} onChange={(e) => {setSyncStorageValue(setting.name, e.currentTarget.value)}}/></label>
    } else if ( setting.type === "desc") {
        return <div  className="desc">
            {lang.SETTINGS_ITEMS[settingName].name ?? setting.name}
            {setting.href && <a href={setting.href} target="_blank">{lang.SETTINGS_ITEMS[settingName].linktitle ?? "LINK"}</a>}
        </div>
    } else if ( setting.type === "group") {
        return <details  className="settings-group">
            <summary>{( lang.SETTINGS_ITEMS[settingName] && lang.SETTINGS_ITEMS[settingName].name ) ?? setting.name}</summary>
            {setting.children && setting.children.map((elem) => {
                return <CreateSettingsControl setting={elem} key={`${elem.name}-group-children`}/>
            })}
        </details>
    } else {
        return <label >Unknown settings type</label>
    }
}

function LinkElem({ setting }: { setting: setting }) {
    const lang = useLang()
    if ( setting.settingLink ) {
        const settingsLink = lang[setting.settingLink.name as keyof typeof lang] as string
        return <a target="_self" className="settinglink" href={setting.settingLink.href}>{settingsLink ?? setting.settingLink.name}</a>
    } else {
        return <></>
    }
}
function HintElem({ setting }: { setting: setting }) {
    const lang: any = useLang()
    if ( lang.SETTINGS_ITEMS[setting.name].hint && lang.SETTINGS_ITEMS[setting.name].hint !== "" ) {
        return <div className="hint">{lang.SETTINGS_ITEMS[setting.name].hint ?? ""}</div>
    } else {
        return <></>
    }
}

function CreateSettingsRow({ setting }: { setting: setting } ) {
    //console.log(syncStorage[settings.name])
    let elemList = [<CreateSettingsControl setting={setting} key={setting.name}/>]
    if ( setting.children && setting.type !== "group" ) {
        //console.log(settings.children)
        const childrenSettingsElemList = setting.children.map((elem) => {
            return <CreateSettingsControl setting={elem} key={setting.name}/>
        })
        //console.log(childrenSettingsElemList)
        elemList = [...elemList, ...childrenSettingsElemList]
    }
    return <div className="settings-row">{ elemList }<HintElem setting={setting}/><LinkElem setting={setting}/></div>
}

function CreateSettingsList({settings}: {settings: settingList}) {

    const elemArray = Object.keys(settings).map((elem) => {
        const settingsAreaElems = settings[elem].map((settingsElem) => {
            //console.log(settingsElem)
            return <CreateSettingsRow setting={settingsElem} key={`${settingsElem.name}-row`}/>
        })
        return <div className="settings-area" key={`${elem}-area`} id={elem}>{settingsAreaElems}</div>
    })
    //console.log(elemArray)
    return <>
        { elemArray }
    </>
}


export default CreateSettingsList;
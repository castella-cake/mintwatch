import SettingRow from "./SettingRow";

export default function SettingsList({ categoryName }: { categoryName: string }) {
    if (!playerSettings[categoryName]) return
    return Object.keys(playerSettings[categoryName].children).map((settingKey, index) => <SettingRow settingKey={settingKey} key={settingKey}/>)
}
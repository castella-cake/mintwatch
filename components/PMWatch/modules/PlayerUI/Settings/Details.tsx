import SettingsList from "./SettingsList";

export default function Details({ settingKey, setting }: { settingKey: string, setting: PlayerSetting }) {
    return <details>
        <summary>{setting.name}</summary>
        {setting.detailsTarget && <SettingsList categoryName={setting.detailsTarget}/>}
    </details>
}
import { playerSettings, toFlatPlayerSettings } from "@/utils/playerSettingList";
import PercentageSliders from "./PercentageSliders";
import Checkbox from "./Checkbox";
import Select from "./Select";
import Details from "./Details";

export default function SettingRow({ settingKey }: { settingKey: string }) {
    const setting = toFlatPlayerSettings(playerSettings)[settingKey]
    return <div className="playersettings-item">
        { setting.type === "select" && <Select setting={setting} settingKey={settingKey}/> }
        { setting.type === "checkbox" && <Checkbox setting={setting} settingKey={settingKey}/> }
        { setting.type === "percentageSliders" && <PercentageSliders setting={setting} settingKey={settingKey}/> }
        { setting.type === "details" && <Details setting={setting} settingKey={settingKey}/> }
        { setting.hint && <div className="playersettings-hint">{setting.hint}</div> }
    </div>
}
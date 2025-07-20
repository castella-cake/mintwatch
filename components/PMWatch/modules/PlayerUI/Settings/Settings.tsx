import { playerSettings, playerSettingsLabel } from "@/utils/playerSettingList";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Stacker } from "../../Stacker";
import SettingsList from "./SettingsList";


const manifestData = browser.runtime.getManifest();

function Settings({ isStatsShown, setIsStatsShown, nodeRef }: {isStatsShown: boolean, setIsStatsShown: Dispatch<SetStateAction<boolean>>, nodeRef: RefObject<HTMLDivElement | null>}) {
    return <div className="playersettings-container" id="pmw-player-settings" ref={nodeRef}>
        <div className="playersettings-title">
            プレイヤー設定
            <span className="playersettings-version">
                v{manifestData.version_name || manifestData.version || "Unknown"}
            </span>
        </div>
        <p>
            この設定はローカルに保存されます。<br/>
            視聴ページの設定は左上のスパナアイコンから設定できます。<br/>
        </p>
        <Stacker items={Object.keys(playerSettings).map((name) => {
            if (playerSettings[name].visible === false) return undefined
            return {
                title: playerSettingsLabel[name as keyof typeof playerSettingsLabel],
                content: <SettingsList categoryName={name}/>
            }
        }).filter(item => item !== undefined)}/>
        <div className="playersettings-item">
            <label>
                <input type="checkbox" checked={isStatsShown} onChange={(e) => {setIsStatsShown(e.currentTarget.checked)}}/>
                統計情報を表示(一時的)
            </label>
        </div>
    </div>
}


export default Settings;
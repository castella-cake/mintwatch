import { useStorageContext } from "@/hooks/extensionHook";
import { Dispatch, RefObject, SetStateAction } from "react";


const manifestData = browser.runtime.getManifest();

type setting = {
    type: "select" | "checkbox"
    options?: any[],
    defaultValue: any,
    texts?: string[],
    name: string,
    hint?: string,
}

const settings: { [key: string]: setting } = {
    playerAreaSize: {
        type: "select",
        options: [0,1,2],
        defaultValue: 1,
        texts: ["小", "中", "フル"],
        name: "ページサイズ",
        hint: "3カラムでは常にフル表示になります。"
    },
    commentOpacity: {
        type: "select",
        options: [0.25, 0.5, 0.75, 1],
        defaultValue: 1,
        texts: ["非常に薄い(25%)", "薄い(50%)", "やや薄い(75%)", "透過なし"],
        name: "コメント透過",
    },
    playbackRate: {
        type: "select",
        options: [0.1,0.25,0.5,0.75,1,1.25,1.5,1.75,2],
        texts: ["x0.1", "x0.25", "x0.5", "x0.75", "x1", "x1.25", "x1.5", "x1.75", "x2"],
        name: "再生速度",
        defaultValue: 1.0,
    },
    integratedControl: {
        type: "select",
        defaultValue: "never",
        options: ["never","fullscreen","always"],
        texts: ["分割表示","全画面時のみ統合表示","常に統合表示"],
        name: "コントローラーの表示",
    },
    sharedNgLevel: {
        type: "select",
        defaultValue: "mid",
        options: ["none","low","mid","high"],
        name: "共有NGコメントレベル",
        texts: ["なし","低 (< -10000)","中 (< -4800)","高 (< -1000)"],
    },
    commentRenderFps: {
        type: "select",
        defaultValue: -1,
        options: [30, 60, 120, -1],
        name: "コメント描画FPS",
        texts: ["30FPS","60FPS","120FPS", "自動"],
    },
    resumePlayback: {
        type: "select",
        defaultValue: "smart",
        options: ["never", "smart", "always"],
        texts: ["しない", "スマート", "常に"],
        name: "レジューム再生",
        hint: "プレミアム会員資格が必要です。"
    },
    enableContinuousPlay: {
        type: "checkbox",
        defaultValue: true,
        name: "再生キューで連続再生",
    },
    continuousPlayWithRecommend: {
        type: "checkbox",
        defaultValue: false,
        name: "連続再生におすすめを含める",
        hint: "再生キューに動画がない場合に、おすすめ動画を連続再生します。"
    },
    enableFancyRendering: {
        type: "checkbox",
        name: "高解像度でコメントを描画",
        defaultValue: false,
        hint: "弾幕が流れている場合などにフレームレートが低下する可能性があります。"
    },
    enableInterpolateCommentRendering: {
        type: "checkbox",
        name: "コメントの補完描画",
        defaultValue: true,
        hint: "Firefox 環境で大幅にフレームレートが改善します。"
    },
    enableCommentPiP: {
        type: "checkbox",
        defaultValue: false,
        name: "PiPでコメントを表示(実験的)",
        hint: "コメント透過率と描画FPSが固定されます。"
    },
    enableWheelGesture: {
        type: "checkbox",
        defaultValue: true,
        name: "音量ジェスチャーを使用",
        hint: "動画の上で右クリックしながらホイールを回して音量を変更できます。"
    },
    disableCommentOutline: {
        type: "checkbox",
        defaultValue: false,
        name: "コメントの縁取りを無効化"
    },
    enableLoudnessData: {
        type: "checkbox",
        defaultValue: true,
        name: "ラウドネスノーマライズ"
    },
    pauseOnCommentInput: {
        type: "checkbox",
        defaultValue: false,
        name: "コメント入力時に一時停止してプレビュー",
    },
    requestMonitorFullscreen: {
        type: "checkbox",
        defaultValue: true,
        name: "モニターサイズのフルスクリーンを使用",
    },
}

function Settings({ isStatsShown, setIsStatsShown, nodeRef }: {isStatsShown: boolean, setIsStatsShown: Dispatch<SetStateAction<boolean>>, nodeRef: RefObject<HTMLDivElement | null>}) {
    const { localStorage, setLocalStorageValue } = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }
    
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

        { Object.keys(settings).map((name, index) => {
            const elem = settings[name]
            if ( elem.type === "select" ) {
                return <div className="playersettings-item" key={name}>
                    <label>
                        {elem.name}
                        <select value={localStorage.playersettings[name] || elem.defaultValue} onChange={(e) => {writePlayerSettings(name, e.currentTarget.value)}}>
                            {elem.options && elem.options.map((option, index) => {
                                return <option value={option} key={`${name}-${index}`}>{elem.texts && elem.texts[index]}</option>
                            })}
                        </select>
                    </label>
                    { elem.hint && <div className="playersettings-hint">{elem.hint}</div> }
                </div>
            } else if ( elem.type === "checkbox" ) {
                return <div className="playersettings-item" key={name}>
                    <label>
                        <input type="checkbox" checked={localStorage.playersettings[name] ?? elem.defaultValue} onChange={(e) => {writePlayerSettings(name, e.currentTarget.checked)}}/>
                        {elem.name}
                    </label>
                    { elem.hint && <div className="playersettings-hint">{elem.hint}</div> }
                </div>
            }
        }) }
        <div className="playersettings-item">
            <label>
                <input type="checkbox" checked={isStatsShown} onChange={(e) => {setIsStatsShown(e.currentTarget.checked)}}/>
                統計情報を表示(一時的)
            </label>
        </div>
    </div>
}


export default Settings;
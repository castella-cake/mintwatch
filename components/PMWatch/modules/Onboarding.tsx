import { RefObject } from "react";

export function OnboardingPopup({ onOnboardOpen, nodeRef }: { onOnboardOpen: () => void, nodeRef: RefObject<HTMLDivElement | null> }) {
    const { localStorage, setLocalStorageValue} = useStorageContext()
    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage
    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }
    return <div className="pmw-onboarding-popup-wrapper" ref={nodeRef}>
        <div className="pmw-onboarding-popup">
            <h2>MintWatch で視聴中です</h2>
            <div className="pmw-onboarding-popup-text">
                MintWatch へようこそ。現在ベータ段階です。<br/>
                「はじめに」を確認しておくことをおすすめします。
            </div>  
            <div className="pmw-onboarding-popup-buttons">
                <button className="pmw-onboarding-popup-button-primary" onClick={onOnboardOpen}>MintWatch のはじめに</button>
                <button onClick={() => {writePlayerSettings("onboardingIgnored", true)}}>閉じる</button>
            </div>
        </div>
    </div>
}

export function OnboardingHelp() {
    return <div className="pmw-onboarding-help-content">
        <p>
            MintWatch へようこそ。<br/>
            MintWatch は、現在のニコニコユーザーのために設計された、簡潔でカスタマイズ可能な視聴ページです。
        </p>
        <p>
            現在ベータ版で、要素はいつでも変更される可能性があります。<br/>
            フィードバックやバグがある場合は、遠慮なく Discord や Issue に報告してください。
        </p>
        <h2>使い方</h2>
        <p>
            MintWatch は、通常の視聴ページと透過的な使用感を目指して設計されています。<br/>
            未実装の機能を除いて、ほぼ求めているものはその場所にあります。
        </p>
        <p>
            レイアウトの設定は、ヘッダーの左端にあるスパナアイコンから「MintWatch の設定」を開くことで行えます。<br/>
            全体的なページ幅や、プレイヤーに関する設定は、プレイヤーコントローラーの歯車アイコンから「プレイヤー設定」を開いてください。
        </p>
        <p>
            ショートカットキーは開発中で、限定的です。現在は以下のショートカットキーが使用できます:
        </p>
        <ul>
            <li>Space: 再生/一時停止</li>
            <li>矢印キー左/右: 10秒戻し/送り</li>
            <li>C: コメントへフォーカス</li>
            <li>F: フルスクリーン</li>
        </ul>
        <h2>Firefox (Gecko) での動作</h2>
        <p>
            Firefox 系ブラウザでの動作は一部制限があります。<br/>
            HLSは技術的制約により、ページスクリプトとして動作するプラグインとして実装されています。
        </p>
        <p>
            画質セレクターは使用可能ですが、再生時の画質は自動設定に固定されます。また、稀に使用不可になることがあります。<br/>
            また、シークバーのバッファ表示は利用できません。
        </p>
        <h2>あなた好みの視聴ページになります</h2>
        <p>
            CSS に関する知識があれば、MintWatch の明確なクラス名によって簡単にカスタムCSSを作成することができます。<br/>
            ユーザースタイルやユーザースクリプトの追加にはその他の拡張機能が必要です。
        </p>
    </div>
}
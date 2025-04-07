import { RefObject } from "react";
import { useSetVideoActionModalStateContext } from "./Contexts/ModalStateProvider";

export function OnboardingPopup({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const { localStorage, setLocalStorageValue} = useStorageContext()

    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage

    const setVideoActionModalState = useSetVideoActionModalStateContext()

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
                <button className="pmw-onboarding-popup-button-primary" onClick={() => setVideoActionModalState("help")}>MintWatch のはじめに</button>
                <button onClick={() => {writePlayerSettings("onboardingIgnored", true)}}>閉じる</button>
            </div>
        </div>
    </div>
}
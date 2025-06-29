import { IconAlertTriangle, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";
import { useSetAlertContext } from "./Contexts/AlertProvider";

function PluginList() {
    const { showAlert } = useSetAlertContext()
    const [ isPluginListShown, setIsPluginListShown ] = useState(false)

    const onTestOpen = () => {
        showAlert({
            title: "ただいまテスト中",
            body: "テスト用のダイアログです。\nこの操作は元に戻せます。続行しますか？",
            icon: <IconAlertTriangle/>,
            customCloseButton: [
                { text: "キャンセル", key: "cancel" },
                { text: "わかった", key: "ok" },
            ],
            onClose: (key) => {
                if (key === "ok") {
                    showAlert({
                        title: "わかった",
                        body: "ごいけん　ありがとうございます！\nそれでは　また！",
                    })
                }
            }
        })
    }

    return <footer className="pmw-footer" id="pmw-footer">
        <div className="footer-items global-flex">
            <button type="button" className="plugin-list-title" onClick={() => {setIsPluginListShown(!isPluginListShown)}}>
                プラグインリスト{ isPluginListShown ? <IconChevronUp/> :<IconChevronDown/>}
            </button>
            <div className="footer-links global-flex1">
                <a href="https://github.com/sponsors/castella-cake" target="_blank" rel="noopener noreferrer" className="titlelink">Sponsor</a>
                <a href="https://github.com/castella-cake/niconico-peppermint-extension/issues" target="_blank" rel="noopener noreferrer" className="titlelink">Feedback</a>
                <button className="footer-pagetop-button" onClick={() => {window.scroll({ top: 0, behavior: "smooth" })}}><IconChevronUp/><span>PAGE TOP</span></button>
                <button className="footer-pagetop-button" onClick={onTestOpen}><IconChevronUp/><span>OPEN</span></button>
            </div>
        </div>
        <div className={isPluginListShown ? "plugin-list-display" : "plugin-list-display-hidden"}>
            <p>
                このプラグインリストは、視聴ページのコンポーネントによって管理されていません。<br/>
                各表示はプラグインのスクリプトによって自己管理されます。<br/>
                もしこの下に何も表示されなければ、まだプラグインが何もインストールされていないか、ここに表示をしていません。
            </p>
            <div id="pmw-plugin-list">
            </div>
        </div>
    </footer>
}


export default PluginList;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CreateSettingsList from "@/components/pages/SettingsUI";
import lang from "@/langs/ja.json";
import { StorageProvider } from "@/hooks/extensionHook";

import { ErrorBoundary } from "react-error-boundary";

import "./settingsUI.styl"
import settings from "@/utils/settingsList";

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("root element not found");
createRoot(rootElement).render(
    <StrictMode>
        <StorageProvider>
            <div className="container">
                <div className="title-container">
                    <div className="title toptitle"><a href="settings.html" target="_blank" rel="noopener noreferrer" className="optlink">MintWatch</a></div>
                    <div className="titlelink-container">
                        <a href="https://discord.com/invite/GNDtKuu5Rb" target="_blank" rel="noopener noreferrer" className="titlelink">Discord</a>
                        <a href="https://github.com/castella-cake/niconico-peppermint-extension/issues" target="_blank" rel="noopener noreferrer" className="titlelink">Feedback</a>
                    </div>
                </div>
                <div className="settings-page-desc">{lang.SETTINGS_DESC}</div>
                <div className="maincontainer">
                    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => {
                        return <div style={{ background: "var(--bgcolor3)", color: "var(--textcolor3)"}}>
                            表示中に重大なエラーが発生しました: {error.message}
                        </div>
                    }}>
                        <CreateSettingsList settings={settings}/>
                    </ErrorBoundary>
                    <div className="settings-area">
                        <div className="settings-row">
                            <h1>Dangerous Area</h1>
                            <div>
                                ここにあるものは、使い方次第で便利に使用できるものもあれば、使い方次第で全ての設定が削除される場合があります。<br />
                                また、自分が何をしているか正しく理解せずに使用するとPepperMintの正常動作を妨げる可能性があるため、注意して取り扱ってください！  
                            </div>
                            <a href="storagemanage.html" target="_self" className="settinglink">ユーザーデータの管理...</a>
                        </div>
                    </div>
                </div>
                <div id="info-area" className="includelinks">
                    <div className="hint">
                        MintWatch を一時的に無効にする場合は、ヘッダーにあるドアのアイコンをクリックします。<br/>
                        再度オンにするまで無効にしたい場合は、拡張機能自体を無効化してください。<br/>
                        設定は自動保存されます。保存した設定を反映させるには、リロードする必要があります。<br/>
                        MintWatch の更新後に表示が崩れた場合は、Ctrl+Shift+Rでハード再読み込みを試してみてください。
                    </div>
                    MintWatch <a href="https://github.com/castella-cake/niconico-peppermint-extension" target="_blank" rel="noopener noreferrer">Github Repo</a><br/>
                    Created by CYakigasi <a href="https://www.cyakigasi.net" target="_blank" rel="noopener noreferrer" style={{marginRight: 4}}>Website</a>
                    <a href="https://www.nicovideo.jp/user/92343354" target="_blank" rel="noopener noreferrer" style={{marginRight: 4}}>Niconico</a>
                    <a href="https://discord.com/invite/GNDtKuu5Rb" target="_blank" rel="noopener noreferrer" style={{marginRight: 4}}>Discord</a>
                    <a href="https://www.cyakigasi.net/links" target="_blank" rel="noopener noreferrer" style={{marginRight: 4}}>SNS Links(Misskey,Bluesky,Twitter...)</a> <br/>
                    <a href="credit.html" target="_self" className="settinglink">MintWatch について...</a>    
                </div>
            </div>
        </StorageProvider>
    </StrictMode>,
);
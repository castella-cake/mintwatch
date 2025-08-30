import CreateSettingsList from "@/components/pages/SettingsUI"
import settings from "@/utils/settingsList"
import { IconMaximize, IconX } from "@tabler/icons-react"
import { RefObject } from "react"
import { CSSTransition } from "react-transition-group"
import { useMintConfigShownContext, useSetMintConfigShownContext } from "@/components/Global/Contexts/ModalStateProvider"

export function MintConfig({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const manifestData = useManifestData()
    const settingsObject = { mintwatch: settings.mintwatch, header: settings.header }

    const mintConfigShown = useMintConfigShownContext()
    const setMintConfigShown = useSetMintConfigShownContext()
    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={
                mintConfigShown === "quick"
            }
            timeout={300}
            unmountOnExit
            classNames="mintconfig-transition"
        >
            <div className="mintwatch-config" id="pmw-config" ref={nodeRef}>
                <h2>
                    MintWatch の設定
                    <button onClick={() => { setMintConfigShown("settings") }} title="モーダルで開く"><IconMaximize /></button>
                    <button onClick={() => { setMintConfigShown(false) }} title="閉じる"><IconX /></button>
                </h2>
                <CreateSettingsList settings={settingsObject} />
                <div className="mintwatch-config-credit">
                    <p>
                        v
                        {manifestData.version_name ?? manifestData.version ?? "?(Unknown Version)"}
                        {" "}
                        Developed by CYakigasi
                        <br />
                        Special Thanks to niconicomments
                    </p>
                </div>
            </div>
        </CSSTransition>
    )
}

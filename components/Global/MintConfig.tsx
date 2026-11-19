import CreateSettingsList from "@/components/pages/SettingsUI"
import settings from "@/utils/settingsList"
import { IconMaximize, IconX } from "@tabler/icons-react"
import { RefObject } from "react"
import { useTransitionState } from "react-transition-state"
import { useMintConfigShownContext, useSetMintConfigShownContext } from "@/components/Global/Contexts/ModalStateProvider"
import { MWButton } from "@/components/Global/MWButton"
import { useOutsideClose } from "@/hooks/useOutsideClose"

export function MintConfig({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const manifestData = useManifestData()
    const settingsObject = { mintwatch: settings.mintwatch, header: settings.header }

    const mintConfigShown = useMintConfigShownContext()
    const setMintConfigShown = useSetMintConfigShownContext()
    const isOpen = mintConfigShown === "quick"
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 300,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
    })
    useEffect(() => {
        toggle(isOpen)
    }, [isOpen])
    useOutsideClose(nodeRef, isOpen, () => setMintConfigShown(false), "mintconfig")
    if (!isMounted) return null
    return (
        <div className="mintwatch-config" id="pmw-config" ref={nodeRef} data-animation={status}>
            <h2>
                MintWatch の設定
                <MWButton label="モーダルで開く" onClick={() => { setMintConfigShown("settings") }}><IconMaximize /></MWButton>
                <MWButton label="閉じる" onClick={() => { setMintConfigShown(false) }}><IconX /></MWButton>
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
    )
}

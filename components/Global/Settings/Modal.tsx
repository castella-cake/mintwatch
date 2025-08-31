import {
    IconComet,
    IconCookie,
    IconHelpCircle,
    IconKeyboard,
    IconTool,
    IconX,
} from "@tabler/icons-react"
import ReactFocusLock from "react-focus-lock"
import { ReactNode, RefObject } from "react"
import { MarkdownHelp } from "./MarkdownHelp"
import { KeyboardShortcuts } from "./KeyboardShortcuts"
import { CSSTransition } from "react-transition-group"
import { useMintConfigShownContext, useSetMintConfigShownContext } from "@/components/Global/Contexts/ModalStateProvider"
import MintWatchIcon from "@/public/mintwatch-white.svg?react"
import { AboutMintWatch } from "./About"

import settings from "@/utils/settingsList"
import CreateSettingsList from "@/components/pages/SettingsUI"
import { useSetMessageContext } from "../Contexts/MessageProvider"
const settingsObject = { mintwatch: settings.mintwatch, header: settings.header }

// nodeRef をリフトアップするのは外側を押したときの検知に必要だよ おぼえておこうね
export function MintWatchModal({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const mintModalState = useMintConfigShownContext()
    const setMintModalState = useSetMintConfigShownContext()

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={mintModalState !== false && mintModalState !== "quick"}
            timeout={300}
            unmountOnExit
            classNames="modal-transition"
        >
            <ReactFocusLock>
                <div className="modal-wrapper" ref={nodeRef}>
                    <div className="modal-container" data-select-placement="top">
                        <div className="modal-header global-flex">
                            <h2 className="global-flex1">
                                {returnTitle(mintModalState)}
                            </h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setMintModalState(false)
                                }}
                                title="閉じる"
                            >
                                <IconX />
                            </button>
                        </div>
                        <div className="modal-selector">
                            <div className="modal-select-separator">設定</div>
                            <TabButton
                                stateKey="settings"
                            >
                                <IconTool />
                                {" "}
                                設定
                            </TabButton>
                            <div className="modal-select-separator select-separator-bottom">ヘルプ</div>

                            <TabButton
                                stateKey="whatsnew"
                                isBottom={true}
                            >
                                <IconComet />
                                {" "}
                                更新情報
                            </TabButton>
                            <TabButton
                                stateKey="shortcuts"
                                isBottom={true}
                            >
                                <IconKeyboard />
                                {" "}
                                ショートカット
                            </TabButton>
                            <TabButton
                                stateKey="help"
                                isBottom={true}
                            >
                                <IconHelpCircle />
                                {" "}
                                はじめに
                            </TabButton>
                            <TabButton
                                stateKey="about"
                                isBottom={true}
                            >
                                <MintWatchIcon />
                                {" "}
                                MintWatch について
                            </TabButton>
                        </div>
                        <div className="modal-content">
                            {(mintModalState === "settings") && (
                                <div className="mintwatch-inmodal-config">
                                    <CreateSettingsList settings={settingsObject} />
                                </div>
                            )}
                            {(mintModalState === "help" || mintModalState === "whatsnew") && (
                                <MarkdownHelp contentKey={mintModalState}>
                                    {mintModalState === "whatsnew" && (
                                        <details>
                                            <summary>過去の更新情報</summary>
                                            <MarkdownHelp contentKey="whatsnew_archive" />
                                            <ForgottenThing />
                                        </details>
                                    )}
                                </MarkdownHelp>
                            )}
                            {mintModalState === "shortcuts" && (
                                <KeyboardShortcuts />
                            )}
                            {mintModalState === "about" && (
                                <AboutMintWatch />
                            )}
                        </div>
                    </div>
                </div>
            </ReactFocusLock>
        </CSSTransition>
    )
}

function TabButton({ stateKey, isBottom, children }: { stateKey: ReturnType<typeof useMintConfigShownContext>, isBottom?: boolean, children: ReactNode }) {
    const mintModalState = useMintConfigShownContext()
    const setMintModalState = useSetMintConfigShownContext()
    return (
        <button
            className={`modal-select ${isBottom ? "modal-bottom" : ""}`}
            onClick={() => {
                setMintModalState(stateKey)
            }}
            data-is-active={
                mintModalState === stateKey ? "true" : "false"
            }
        >
            {children}
        </button>
    )
}

function returnTitle(videoActionModalState: ReturnType<typeof useMintConfigShownContext>) {
    if (videoActionModalState === "help" || videoActionModalState === "shortcuts" || videoActionModalState === "whatsnew") return "ヘルプ"
    if (videoActionModalState === "about") return "MintWatch について"
    return "MintWatch の設定"
}

function ForgottenThing() {
    const { showToast } = useSetMessageContext()
    const [clicked, setClicked] = useState(false)
    if (clicked) return
    return (
        <button
            title="Remember?"
            onClick={() => {
                showToast({ title: "忘れ去られた日々", body: "PepperMint農園は覚えている。", icon: <IconCookie /> })
                setClicked(true)
            }}
        >
            🍪
        </button>
    )
}

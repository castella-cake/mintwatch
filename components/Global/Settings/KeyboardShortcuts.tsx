import Arrow from "@/assets/somedancegamearrow.svg?react"
import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import { IconArrowsMove } from "@tabler/icons-react"
const initializeEggCommand = "U,U,D,D,L,R,L,R,b,a"
const lessonEggCommand = "R,L,U,U,D,D,U,U,U,D,R,L,R,L,L,R,R,L,L,L,R,R,R,R,L,L,R,L,R,LR,LR,LR,D,D,R,D,D,R,D,D,R,D,D,R" // Lesson by DJ

export function KeyboardShortcuts() {
    const { rewindTime } = useStorageVar(["rewindTime"], "local")
    const { showToast, showAlert } = useSetMessageContext()
    const [keyPress, setKeyPress] = useState({ left: false, down: false, up: false, right: false })
    const commandHistory = useRef<string[]>([])
    const pressedKeys = useRef<Set<string>>(new Set())
    const [commandAchievements, setCommandAchievements] = useState<number>(0)

    const checkCommand = useCallback(() => {
        const history = commandHistory.current.join(",")
        const lastInputs = history

        // コマンドと同じ長さの履歴を取得して比較
        if (lastInputs === initializeEggCommand || lastInputs === lessonEggCommand) {
            if (lastInputs === lessonEggCommand) {
                if (commandAchievements === 1) {
                    showAlert({ icon: <IconArrowsMove />, title: "MARVELOUS FULL COMBO!!", body: "" })
                }
            } else {
                showToast({ icon: <IconArrowsMove />, title: "GET READY", body: "C'mon, let me hear you say..." })
                setCommandAchievements(1)
            }
            // 正しいコマンドが入力された場合は履歴をリセット
            commandHistory.current = []
            return true
        }

        // コマンドの一部として成立しているか確認
        const isValidSequence = [initializeEggCommand, lessonEggCommand].some(cmd =>
            cmd.startsWith(lastInputs),
        )

        if (!isValidSequence && lastInputs.length > 0) {
            commandHistory.current = []
            return false
        }

        return true
    }, [commandAchievements])

    const updateCommandHistory = useCallback((key: string) => {
        if (pressedKeys.current.size >= 2) {
            const combinedKeys = Array.from(pressedKeys.current).sort().join("")
            commandHistory.current[commandHistory.current.length - 1] = combinedKeys
        } else {
            commandHistory.current.push(key)
            if (commandHistory.current.length > 50) {
                commandHistory.current.shift()
            }
        }
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        let key = ""
        if (e.key === "ArrowLeft") {
            setKeyPress(k => ({ ...k, left: true }))
            key = "L"
        } else if (e.key === "ArrowDown") {
            setKeyPress(k => ({ ...k, down: true }))
            key = "D"
        } else if (e.key === "ArrowUp") {
            setKeyPress(k => ({ ...k, up: true }))
            key = "U"
        } else if (e.key === "ArrowRight") {
            setKeyPress(k => ({ ...k, right: true }))
            key = "R"
        } else if (e.key === "a" || e.key === "b") {
            key = e.key.toLowerCase()
        }

        if (key !== "") {
            pressedKeys.current.add(key)
            updateCommandHistory(key)
            e.preventDefault()
            e.stopPropagation()
            return false
        }
    }, [setKeyPress, updateCommandHistory])

    const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        let key = ""
        if (e.key === "ArrowLeft") {
            setKeyPress(k => ({ ...k, left: false }))
            key = "L"
        } else if (e.key === "ArrowDown") {
            setKeyPress(k => ({ ...k, down: false }))
            key = "D"
        } else if (e.key === "ArrowUp") {
            setKeyPress(k => ({ ...k, up: false }))
            key = "U"
        } else if (e.key === "ArrowRight") {
            setKeyPress(k => ({ ...k, right: false }))
            key = "R"
        } else {
            key = e.key.toLowerCase()
        }

        pressedKeys.current.delete(key)
        checkCommand()
        e.preventDefault()
        e.stopPropagation()
        return false
    }, [setKeyPress, checkCommand])

    return (
        <div className="pmw-help-content pmw-keyboard-help" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={-1}>
            <h1>MintWatch のキーボードショートカット</h1>
            <p>
                現在、基本的なキーボードショートカットのみが実装されています。
                <br />
                視聴ページで使用できるショートカットは以下の通りです。
            </p>
            <div className="pmw-keyboard-shortcuts">
                <KeyShortcutBlock title="再生/一時停止">
                    <kbd>Space</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title={`${rewindTime ?? 10} 秒送り/戻し`}>
                    <kbd>←</kbd>
                    <span className="pmw-keyboard-shortcut-key-text">
                        /
                    </span>
                    <kbd>→</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="1/60 秒送り/戻し">
                    <kbd>,</kbd>
                    <span className="pmw-keyboard-shortcut-key-text">
                        /
                    </span>
                    <kbd>.</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="音量調整 (5%刻み)">
                    <kbd>Shift + ↑</kbd>
                    <span className="pmw-keyboard-shortcut-key-text">
                        /
                    </span>
                    <kbd>Shift + ↓</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="ループ再生の切り替え">
                    <kbd>R</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="コメント入力欄にフォーカス">
                    <kbd>C</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="フルスクリーン再生を開始">
                    <kbd>F</kbd>
                </KeyShortcutBlock>
                <KeyShortcutBlock title="ミュートの切り替え">
                    <kbd>M</kbd>
                </KeyShortcutBlock>
            </div>
            <kbd>Shift+/</kbd>
            {" "}
            を押すと、このヘルプをすぐに表示できます。
            <br />
            <kbd>Esc</kbd>
            {" "}
            を押すとこのウィンドウを閉じます。
            <KeyShortcutBlock title="これらを知って MintWatch MintWatch Revolution 皆伝になろう">
                <span className="pmw-keyboard-shortcut-key-text">
                    このヘルプにフォーカスした状態で
                </span>
                <kbd>←</kbd>
                <kbd>↓</kbd>
                <kbd>↑</kbd>
                <kbd>→</kbd>
                <kbd>a</kbd>
                <kbd>b</kbd>
                <div className="pmw-keyboard-dance">
                    <Arrow data-is-pressed={keyPress.left} data-direction="left" />
                    <Arrow data-is-pressed={keyPress.down} data-direction="down" />
                    <Arrow data-is-pressed={keyPress.up} data-direction="up" />
                    <Arrow data-is-pressed={keyPress.right} data-direction="right" />
                </div>
            </KeyShortcutBlock>
        </div>
    )
}

function KeyShortcutBlock({ title, children }: { title: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="pmw-keyboard-shortcut">
            <div className="pmw-keyboard-shortcut-title">{title}</div>
            <div className="pmw-keyboard-shortcut-keys">
                {children}
            </div>
        </div>
    )
}

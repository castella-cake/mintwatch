import { useVideoInfoContext } from "@/components/Global/Contexts/VideoDataProvider"
import SmallIcon from "@/assets/commandPalette/small.svg?react"
import MediumIcon from "@/assets/commandPalette/medium.svg?react"
import BigIcon from "@/assets/commandPalette/big.svg?react"
import NakaIcon from "@/assets/commandPalette/naka.svg?react"
import ShitaIcon from "@/assets/commandPalette/shita.svg?react"
import UeIcon from "@/assets/commandPalette/ue.svg?react"
import DefontIcon from "@/assets/commandPalette/defont.svg?react"
import GothicIcon from "@/assets/commandPalette/gothic.svg?react"
import MinchoIcon from "@/assets/commandPalette/mincho.svg?react"
import { IconClockShield, IconClockStop, IconLineHeight, IconTrash, IconViewportWide } from "@tabler/icons-react"

export function CommandPalette({
    isOpen,
    commandInputRef,
    currentCommand,
    setCurrentCommandValue,
}: {
    isOpen: boolean
    commandInputRef: React.RefObject<HTMLInputElement | null>
    currentCommand: string
    setCurrentCommandValue: (value: string) => void
}) {
    const { enableShokuninMode } = useStorageVar(["enableShokuninMode"])
    const { videoInfo } = useVideoInfoContext()
    const isPremiumUser = videoInfo?.data.response.viewer?.isPremium || false
    if (!isOpen) return
    return (
        <div className="commandpalette-wrapper">
            <div className="commandpalette-container">
                <h3 className="commandpalette-title">
                    <span>
                        コマンドパレット
                    </span>
                    <button
                        className="commandpalette-clearbutton"
                        onClick={() => {
                            if (commandInputRef.current) {
                                setCurrentCommandValue("")
                            }
                        }}
                        aria-disabled={currentCommand.split(" ").length === 0}
                        title="コマンドをクリア"
                    >
                        <IconTrash />
                    </button>
                </h3>
                {commandList.map((commandGroup) => {
                    const commandStringArray = toCommandItemToStringArray(commandGroup.items)
                    if (commandGroup.isAdvanced && !enableShokuninMode) return
                    return (
                        <div key={commandGroup.kind} className="commandpalette-commandgroup" data-kind={commandGroup.kind}>
                            <div className="commandpalette-commandgroup-items">
                                {commandGroup.items.map((commandItem) => {
                                    if (commandItem.isPremiumOnly && !isPremiumUser) return
                                    return (
                                        <button
                                            key={commandItem.command}
                                            type="button"
                                            className="commandpalette-commandbutton"
                                            onClick={() => {
                                                if (commandInputRef.current) {
                                                    // 同じkindのコマンドが既に存在する場合は置換、存在しない場合は追加
                                                    const currentValue = commandInputRef.current.value
                                                    const valueParts = currentValue.split(" ")
                                                    if (valueParts.includes(commandItem.command)) {
                                                        // 既に存在している場合は削除
                                                        setCurrentCommandValue(valueParts.filter(part => part !== commandItem.command).join(" "))
                                                        return
                                                    }
                                                    if (!commandGroup.isMultipleSelectable && valueParts.some((part) => {
                                                        return commandStringArray.includes(part) || (commandGroup.additionalReplaceTarget && commandGroup.additionalReplaceTarget.test(part))
                                                    })) {
                                                        setCurrentCommandValue([...new Set(valueParts.map((part) => {
                                                            if (
                                                                commandStringArray.includes(part)
                                                                || (commandGroup.additionalReplaceTarget && commandGroup.additionalReplaceTarget.test(part))
                                                            ) {
                                                                return commandItem.command
                                                            } else {
                                                                return part
                                                            }
                                                        }))].join(" "))
                                                    } else {
                                                        if (currentValue.length > 0) {
                                                            setCurrentCommandValue([...currentValue.split(" "), commandItem.command].join(" "))
                                                        } else {
                                                            setCurrentCommandValue(commandItem.command)
                                                        }
                                                    }
                                                }
                                            }}
                                            title={commandItem.alternativeTitle ?? commandItem.command}
                                            data-command={commandItem.command}
                                            data-is-active={removeDulplicateCommands(currentCommand.split(" ")).includes(commandItem.command)}
                                        >
                                            {commandItem.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

type commandListObject = {
    kind: string
    title: string
    items: commandItem[]
    isMultipleSelectable?: boolean
    isAdvanced?: boolean
    additionalReplaceTarget?: RegExp
}

type commandItem = {
    command: string
    label: React.ReactNode
    isPremiumOnly?: boolean
    alternativeTitle?: string
}

const colorCodeRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

/* eslint-disable @stylistic/jsx-closing-tag-location */
const commandList: commandListObject[] = [
    {
        kind: "placement",
        title: "コメント配置",
        items: [
            {
                command: "ue",
                label: <UeIcon />,
            },
            {
                command: "naka",
                label: <NakaIcon />,
            },
            {
                command: "shita",
                label: <ShitaIcon />,
            },
        ],
    },
    {
        kind: "size",
        title: "コメントサイズ",
        items: [
            {
                command: "big",
                label: <BigIcon />,
            },
            {
                command: "medium",
                label: <MediumIcon />,
            },
            {
                command: "small",
                label: <SmallIcon />,
            },
        ],
    },
    {
        kind: "font",
        title: "フォント",
        isAdvanced: true,
        items: [
            {
                command: "defont",
                label: <DefontIcon />,
            },
            {
                command: "gothic",
                label: <GothicIcon />,
            },
            {
                command: "mincho",
                label: <MinchoIcon />,
            },
        ],
    },
    {
        kind: "color",
        title: "コメント色",
        additionalReplaceTarget: colorCodeRegex,
        items: [
            {
                command: "white",
                label: <div className="commandpalette-colorbutton" data-color="white">white</div>,
            },
            {
                command: "red",
                label: <div className="commandpalette-colorbutton" data-color="red">red</div>,
            },
            {
                command: "pink",
                label: <div className="commandpalette-colorbutton" data-color="pink">pink</div>,
            },
            {
                command: "orange",
                label: <div className="commandpalette-colorbutton" data-color="orange">orange</div>,
            },
            {
                command: "yellow",
                label: <div className="commandpalette-colorbutton" data-color="yellow">yellow</div>,
            },
            {
                command: "green",
                label: <div className="commandpalette-colorbutton" data-color="green">green</div>,
            },
            {
                command: "cyan",
                label: <div className="commandpalette-colorbutton" data-color="cyan">cyan</div>,
            },
            {
                command: "blue",
                label: <div className="commandpalette-colorbutton" data-color="blue">blue</div>,
            },
            {
                command: "purple",
                label: <div className="commandpalette-colorbutton" data-color="purple">purple</div>,
            },
            {
                command: "black",
                label: <div className="commandpalette-colorbutton" data-color="black">black</div>,
            },
            {
                command: "white2",
                label: <div className="commandpalette-colorbutton" data-color="white2">white2</div>,
                isPremiumOnly: true,
            },
            {
                command: "red2",
                label: <div className="commandpalette-colorbutton" data-color="red2">red2</div>,
                isPremiumOnly: true,
            },
            {
                command: "pink2",
                label: <div className="commandpalette-colorbutton" data-color="pink2">pink2</div>,
                isPremiumOnly: true,
            },
            {
                command: "orange2",
                label: <div className="commandpalette-colorbutton" data-color="orange2">orange2</div>,
                isPremiumOnly: true,
            },
            {
                command: "yellow2",
                label: <div className="commandpalette-colorbutton" data-color="yellow2">yellow2</div>,
                isPremiumOnly: true,
            },
            {
                command: "green2",
                label: <div className="commandpalette-colorbutton" data-color="green2">green2</div>,
                isPremiumOnly: true,
            },
            {
                command: "cyan2",
                label: <div className="commandpalette-colorbutton" data-color="cyan2">cyan2</div>,
                isPremiumOnly: true,
            },
            {
                command: "blue2",
                label: <div className="commandpalette-colorbutton" data-color="blue2">blue2</div>,
                isPremiumOnly: true,
            },
            {
                command: "purple2",
                label: <div className="commandpalette-colorbutton" data-color="purple2">purple2</div>,
                isPremiumOnly: true,
            },
            {
                command: "black2",
                label: <div className="commandpalette-colorbutton" data-color="black2">black2</div>,
                isPremiumOnly: true,
            },
        ],
    },
    {
        kind: "shokunin",
        title: "職人コマンド",
        isMultipleSelectable: true,
        isAdvanced: true,
        items: [
            {
                command: "full",
                alternativeTitle: "リサイズの基準幅を16:9にします",
                label: <>
                    <IconViewportWide />
                    {" "}
                    full
                </>,
            },
            {
                command: "patissier",
                alternativeTitle: "コメントの表示基準を旧基準へ変更します",
                label: <>
                    <IconClockStop />
                    {" "}
                    patissier
                </>,
            },
            {
                command: "ender",
                alternativeTitle: "改行時のリサイズを無効化します",
                label: <>
                    <IconLineHeight />
                    {" "}
                    ender
                </>,
            },
            {
                command: "ca",
                alternativeTitle: "ニコるによるコメント表示期間延長を無効化します",
                label: <>
                    <IconClockShield />
                    {" "}
                    ca
                </>,
            },
        ],
    },
]
/* eslint-enable @stylistic/jsx-closing-tag-location */

// コマンドアイテムの配列からコマンド文字列のみを取り出す
const toCommandItemToStringArray = (items: commandItem[]): string[] => {
    return items.map(item => item.command)
}

// 重複するkindのコマンドの内、前側にあるものを優先して残す
const removeDulplicateCommands = (commandParts: string[]): string[] => {
    const seenKinds: Set<string> = new Set()
    const resultParts: string[] = []
    for (const part of commandParts) {
        const commandGroup = commandList.find((group) => {
            return toCommandItemToStringArray(group.items).includes(part) || (group.additionalReplaceTarget && group.additionalReplaceTarget.test(part))
        })
        if (commandGroup && !seenKinds.has(commandGroup.kind)) {
            seenKinds.add(commandGroup.kind)
            resultParts.push(part)
        }
    }
    return resultParts
}

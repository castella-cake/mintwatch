import { useSetMessageContext } from "@/components/Global/Contexts/MessageProvider"
import MintWatchLogo from "@/public/mintwatch.svg?react"
import PMFamilyLogo from "@/public/pmfamily.svg?react"
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { IconComet } from "@tabler/icons-react"

const manifestData = browser.runtime.getManifest()

export default function AboutMintWatch() {
    const { showToast } = useSetMessageContext()
    const { showAlert } = useSetMessageContext()
    const [progress, setProgress] = useState<0 | 1 | 2 | 3>(0)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    function dragOverHandler(event: DragOverEvent) {
        if (event.over && event.over.id === "droppableText" && progress === 0) {
            setProgress(1)
        }
    }
    function dragEndHandler(event: DragEndEvent) {
        if (event.over && event.over.id === "droppableLogo" && progress === 2) {
            setProgress(3)
            setTimeout(() => {
                storage.setItem("sync:unlockStarNightSetting", true)
                storage.setItem("sync:starNightPalette", true)
                showToast({ icon: <IconComet />, title: "You did a thing!", body: "パレットが StarNight に変更されました。" })
                showAlert({
                    title: "And now we present...",
                    body: (
                        <div>
                            <p>
                                nothing?
                                <br />
                            </p>
                            <p>
                                そうです。今はベータ期間です。
                                <br />
                                ベータテストに参加してくださった方の名前をここに乗せる予定です。
                                <br />
                                それまでは…登録用のフォームに記入しますか？
                            </p>
                        </div>
                    ),
                    customCloseButton: [
                        {
                            text: "フォームへ記入",
                            key: "openForm",
                            primary: true,
                        },
                        {
                            text: "閉じる",
                            key: "ok",
                        },
                    ],
                    onClose: (type) => {
                        if (type === "openForm") {
                            window.open("https://docs.google.com/forms/d/e/1FAIpQLSeOKWLQbKity9CgayHl6wpwsbaGhTtmrYeEC3JHJ2ti9EGuaQ/viewform?usp=header")
                        }
                    },
                })
            }, 1000)
        }
    }
    return (
        <div className="pmw-help-content about-mintwatch-content">
            <DndContext sensors={sensors} onDragOver={dragOverHandler} onDragEnd={dragEndHandler}>
                <EasterDroppableHeader progress={progress} onUnlock={() => setProgress(2)} />
                <p>
                    MintWatch は、ニコニコ動画用に開発された代替フロントエンドです。
                </p>
                <h2>貢献する</h2>
                <p>
                    MintWatch はオープンソースです。GitHub にリポジトリが公開されています。
                    <br />
                    React + TypeScript の知識をお持ちであれば、コードを変更してプルリクエストを送ることで MintWatch へ貢献できます。
                </p>
                <EasterDraggablePMFamilyLogo />
                <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">GitHub リポジトリを見る</a>
                <p>
                    もしバグや改善してほしい点を見つけた場合は、
                    <br />
                    気軽に Issue を建てるか、Discord サーバーを通して報告をお願いします。
                </p>
                <a href="https://discord.com/invite/GNDtKuu5Rb" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">NicoPM Community に参加する</a>
                <h2>寄付する</h2>
                <p>
                    もし MintWatch や PepperMint+ があなたの役に立っているのであれば、
                    <br />
                    開発者へ Github Sponsors を通して寄付を行うことができます。
                </p>
                <p>
                    このプロジェクトはほぼ一人の手で、多くの時間を掛けて開発されています。
                    <br />
                    寄付はプロジェクトを維持するためのモチベーションの向上に繋がります。
                </p>
                <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">Github Sponsors で寄付する</a>
                <h2>クレジット</h2>
                <p>
                    MintWatch のコメント描画には niconicomments を使用しています。
                    <br />
                    これ以外にも WXT や hls.js などの多くのライブラリを使用しています。
                </p>
                <p>
                    MintWatch や PepperMint の支援者、使用しているライブラリの開発者やメンテナー、
                    <br />
                    そしてユーザーベースの一員となってくださっているあなたに感謝を申し上げます。
                    <br />
                </p>
            </DndContext>
        </div>
    )
}

function EasterDraggablePMFamilyLogo() {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: "pmfamily",
    })
    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: (isDragging ? "grabbing" : "grab"),
    }
    return (
        <span ref={setNodeRef} style={style} {...attributes} {...listeners} className="about-draggable">
            <PMFamilyLogo />
        </span>
    )
}

function EasterDroppableHeader({ progress, onUnlock }: { progress: 0 | 1 | 2 | 3, onUnlock: (event: React.MouseEvent) => void }) {
    const { setNodeRef: setLogoNodeRef } = useDroppable({
        id: "droppableLogo",
    })
    const { setNodeRef: setTextNodeRef } = useDroppable({
        id: "droppableText",
    })
    return (
        <div className="about-mintwatch-header" style={progress >= 1 ? { position: "relative" } : {}}>
            <MintWatchLogo
                key="about-mintwatch-egg-logo"
                ref={setLogoNodeRef as any}
                style={{
                    ...(progress === 2
                        ? {
                                animation: "aboutshake 0.2s linear infinite",
                            }
                        : {}),
                    ...(progress === 3
                        ? {
                                animation: "aboutboom 0.5s linear 1",
                            }
                        : {}),
                }}
            />
            <h1 ref={setTextNodeRef}>
                {progress === 1 && <button onClick={onUnlock}>ロック解除</button>}
                <span key="about-mintwatch-egg-title" style={progress === 1 ? { animation: "aboutshow 0.2s linear 1 forwards", display: "inline-block", position: "absolute" } : {}}>MintWatch</span>
            </h1>
            <span className="about-mintwatch-version">
                v
                {manifestData.version_name || manifestData.version || "Unknown"}
            </span>
        </div>
    )
}

import { IconBook2, IconDotsVertical, IconFolderPin } from "@tabler/icons-react"
import { useTransitionState } from "react-transition-state"

type Props = {
    videoId: string
}

function ExternalLinkMenu({ videoId }: Props) {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: 200,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
        preExit: true,
    })
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current
                && buttonRef.current
                && !menuRef.current.contains(event.target as Node)
                && !buttonRef.current.contains(event.target as Node)
            ) {
                toggle(false)
            }
        }

        if (isMounted) {
            document.addEventListener("mousedown", handleClickOutside, { signal })
        }

        return () => controller.abort()
    }, [isMounted])

    return (
        <div className="videoinfo-externallink-container">
            <button
                ref={buttonRef}
                className="videoinfo-externallink-button"
                title={isMounted ? "外部リンクメニューを閉じる" : "外部リンクメニューを開く"}
                onClick={() => toggle(!isMounted)}
            >
                <IconDotsVertical />
            </button>
            {isMounted && (
                <div ref={menuRef} className="videoinfo-externallink-menu generic-contextmenu" data-animation={status}>
                    <a
                        className="generic-contextmenu-item"
                        href={`https://www.nicovideo.jp/openlist/${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconFolderPin />
                        <span>公開マイリストの一覧を見る</span>
                    </a>
                    <a
                        className="generic-contextmenu-item"
                        href={`https://dic.nicovideo.jp/v/${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconBook2 />
                        <span>大百科記事を開く</span>
                    </a>
                </div>
            )}
        </div>
    )
}

export default ExternalLinkMenu

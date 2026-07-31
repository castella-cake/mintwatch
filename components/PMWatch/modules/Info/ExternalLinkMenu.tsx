import { PopupMenu } from "@/components/Global/PopupMenu"
import { IconBook2, IconDotsVertical, IconFolderPin } from "@tabler/icons-react"

type Props = {
    videoId: string
}

function ExternalLinkMenu({ videoId }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    return (
        <div className="videoinfo-externallink-container">
            <button
                ref={buttonRef}
                className="videoinfo-externallink-button"
                title={isMenuOpen ? "外部リンクメニューを閉じる" : "外部リンクメニューを開く"}
                onClick={() => setIsMenuOpen(s => !s)}
            >
                <IconDotsVertical />
            </button>
            <PopupMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} positionElemRef={buttonRef}>
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
            </PopupMenu>
        </div>
    )
}

export default ExternalLinkMenu

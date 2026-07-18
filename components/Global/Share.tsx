import { IconArrowBackUp, IconCopy, IconDots, IconPlus, IconRepeat } from "@tabler/icons-react"
import "./styleModules/Share.css"

export function Share({ body, plainUrl, ogp }: { body: string, plainUrl: string, ogp: { title: string | null, description: string | null, image: string | null, siteName: string | null } }) {
    const [copiedLink, setCopiedLink] = useState("")

    const shareIntents = {
        twitter: `https://x.com/intent/tweet?text=${encodeURIComponent(body)}`,
        misskeyHub: `https://misskey-hub.net/share/?text=${encodeURIComponent(body)}&visibility=public&localOnly=0`,
        bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(body)}`,
    }

    const handleLinkCopy = useCallback(() => {
        navigator.clipboard.writeText(plainUrl).then(() => {
            setCopiedLink(plainUrl)
        })
    }, [plainUrl])

    return (
        <div className="share-container">
            <div className="share-preview">
                <div className="share-dummy-icon"></div>
                <div className="share-dummy-name">投稿のプレビュー</div>
                <div className="share-dummy-handle">@example.com@social.example.com</div>
                <div className="share-body">
                    {body}
                </div>
                { ogp.image && (
                    <div className="share-ogp">
                        <img src={ogp.image} alt="ダミーのOGP サムネイル" className="share-ogp-thumbnail" />
                        <div className="share-ogp-title">{ogp.title ?? <span className="share-ogp-unavailable">タイトル不明</span>}</div>
                        <div className="share-ogp-description">
                            {ogp.description ?? (
                                <span className="share-ogp-unavailable">
                                    OGP 情報を推定できません。
                                </span>
                            )}
                        </div>
                        <div className="share-ogp-site-name">{ogp.siteName ?? <span className="share-ogp-unavailable">サイト名不明</span>}</div>
                    </div>
                )}
                <div className="share-dummy-actions">
                    <IconArrowBackUp />
                    <IconRepeat />
                    <IconPlus />
                    <IconDots />
                </div>
            </div>
            <div className="share-buttons">
                <a className="share-button share-button-x" href={shareIntents["twitter"]} target="_blank" rel="noreferrer">
                    <span>
                        X に共有
                    </span>
                </a>
                <a className="share-button share-button-misskey" href={shareIntents["misskeyHub"]} target="_blank" rel="noreferrer">
                    <span>
                        Misskey に共有
                    </span>
                </a>
                <a className="share-button share-button-bluesky" href={shareIntents["bluesky"]} target="_blank" rel="noreferrer">
                    <span>
                        Bluesky に共有
                    </span>
                </a>
                <button className="share-button share-button-copy-url" onClick={handleLinkCopy}>
                    <IconCopy />
                    <span>{copiedLink === plainUrl ? "コピーしました" : "リンクをコピー"}</span>
                </button>
            </div>
        </div>
    )
}

export function ShareApplet({ body, plainUrl, ogp }: { body: string, plainUrl: string, ogp: { title: string, description: string | null, image: string, siteName: string } }) {
    return (
        <div className="share-applet-container applet-container">
            <div className="applet-subtitle">
                <strong>
                    {ogp.title}
                </strong>
                {" "}
                を共有します
            </div>
            <Share
                body={body}
                plainUrl={plainUrl}
                ogp={ogp}
            />
        </div>
    )
}

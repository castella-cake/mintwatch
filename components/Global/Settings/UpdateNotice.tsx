import { IconBrandDiscord, IconBrandGithub, IconTipJar } from "@tabler/icons-react"

export function UpdateNotice() {
    return (
        <div className="mintwatch-update-notice">
            <div className="mintwatch-update-notice-title">
                Hello, MintWatcher!
            </div>
            <div className="mintwatch-update-notice-body">
                NicoPM Community の Discord では、MintWatch の更新情報を受け取ったり、フィードバックを送ったりすることができます。
                <br />
                また、MintWatch は、個人のオープンソースプロジェクトとして開発されています。
                <br />
                GitHub Sponsors で支援したり、リポジトリから Issue や Pull Request を送ることができます。
            </div>
            <div className="mintwatch-update-notice-links">
                <a href="https://discord.com/invite/GNDtKuu5Rb" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">
                    <IconBrandDiscord />
                    <span>NicoPM Community へ参加する</span>
                </a>
                <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">
                    <IconBrandGithub />
                    <span>GitHub リポジトリを見る</span>
                </a>
                <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink" rel="noreferrer">
                    <IconTipJar />
                    <span>Github Sponsors で寄付する</span>
                </a>
            </div>
        </div>
    )
}

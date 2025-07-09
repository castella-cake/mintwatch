import MintWatchLogo from "@/public/mintwatch.svg?react"

const manifestData = browser.runtime.getManifest();

export default function AboutMintWatch() {
    return <div className="pmw-help-content about-mintwatch-content">
        <div className="about-mintwatch-header">
            <MintWatchLogo/>
            <h1>MintWatch</h1>
            <span className="about-mintwatch-version">v{manifestData.version_name || manifestData.version || "Unknown"}</span>
        </div>
        <p>
            MintWatch は、ニコニコ動画用に開発された代替フロントエンドです。
        </p>
        <h2>貢献する</h2>
        <p>
            MintWatch はオープンソースです。GitHub にリポジトリが公開されています。<br/>
            React + TypeScript の知識をお持ちであれば、コードを変更してプルリクエストを送ることで MintWatch へ貢献できます。
        </p>
        <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink">GitHub リポジトリを見る</a>
        <p>
            もしバグや改善してほしい点を見つけた場合は、<br/>
            気軽に Issue を建てるか、Discord サーバーを通して報告をお願いします。
        </p>
        <a href="https://discord.com/invite/GNDtKuu5Rb" target="_blank" className="about-mintwatch-buttonlink">NicoPM Community に参加する</a>
        <h2>寄付する</h2>
        <p>
            もし MintWatch や PepperMint+ があなたの役に立っているのであれば、<br/>
            開発者へ Github Sponsors を通して寄付を行うことができます。
        </p>
        <p>
            このプロジェクトはほぼ一人の手で、多くの時間を掛けて開発されています。<br/>
            寄付はプロジェクトを維持するためのモチベーションの向上に繋がります。
        </p>
        <a href="https://github.com/castella-cake/mintwatch" target="_blank" className="about-mintwatch-buttonlink">Github Sponsors で寄付する</a>
        <h2>クレジット</h2>
        <p>
            MintWatch のコメント描画には niconicomments を使用しています。<br/>
            これ以外にも WXT や hls.js などの多くのライブラリを使用しています。
        </p>
        <p>
            MintWatch や PepperMint の支援者、使用しているライブラリの開発者やメンテナーに感謝を表します。<br/>
            そして、ユーザーベースの一員となってくださっているあなたにも感謝します。<br/>
        </p>
    </div>
}
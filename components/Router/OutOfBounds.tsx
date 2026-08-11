import { IconBoom } from "@tabler/icons-react"

const manifestData = browser.runtime.getManifest()
const userAgent = navigator.userAgent

export function OutOfBounds({ error }: { error: unknown }) {
    const isError = error instanceof Error
    return (
        <div className="pmwatch-outofbound-wrapper">
            <div className="pmwatch-outofbound-container">
                <h2>
                    <IconBoom />
                    {" "}
                    <span>Aw, snap!</span>
                </h2>
                <p>
                    申し訳ありません。MintWatch で重大なエラーが発生しました。
                    <br />
                    この問題を開発者に GitHub もしくは Discord 経由で報告してください。
                </p>
                <p className="pmwatch-outofbound-msg">
                    <code>{isError ? error.message : "エラー情報は利用できません"}</code>
                </p>
                {isError && error.stack && (
                    <>
                        <p>
                            コールスタック:
                        </p>
                        <pre className="pmwatch-outofbound-msg">
                            <code>{error.stack}</code>
                        </pre>
                    </>
                )}
                <p>
                    <pre className="pmwatch-outofbound-msg">
                        MintWatch Version:
                        {" "}
                        {manifestData.version_name || manifestData.version || "Unknown"}
                        {"\nUserAgent: "}
                        {userAgent}
                    </pre>
                </p>
                <p className="pmwatch-outofbound-button-container">
                    ページを再読み込みして再試行できます。
                    <br />
                    <a href="https://www.nicovideo.jp/video_top">
                        ニコニコ動画へ戻る
                    </a>
                    <button onClick={() => {
                        window.location.href = `${window.location.href}${window.location.href.includes("?") ? "&" : "?"}nopmw=true`
                    }}
                    >
                        元のページを開く
                    </button>
                </p>
            </div>
        </div>
    )
}

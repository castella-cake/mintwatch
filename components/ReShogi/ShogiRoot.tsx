import { StrictMode } from "react";

//import "./index.styl"
import { ErrorBoundary } from "react-error-boundary";
import { StorageProvider } from "@/hooks/extensionHook";
import { IconBoom } from "@tabler/icons-react";
import { ModalStateProvider } from "@/components/Global/Contexts/ModalStateProvider";
import PluginList from "@/components/Global/PluginList";
import ShogiBody from "./ShogiBody";

export function reShogi() {
    return (
        <StrictMode>
            <StorageProvider>
                <ModalStateProvider>
                    <ErrorBoundary
                        fallbackRender={({ error }: { error: Error }) => {
                            return (
                                <div className="pmwatch-error-boundary-wrapper">
                                    <div className="pmwatch-error-boundary-container">
                                        <h1>
                                            <IconBoom /> Aw, snap!
                                        </h1>
                                        <p>
                                            申し訳ありません。MintWatch の表示中に重大なエラーが発生しました。<br />
                                            この問題を開発者に Github もしくは Discord 経由で報告してください。
                                        </p>
                                        <p className="pmwatch-error-boundary-msg">
                                            <code>{error.message}</code>
                                        </p>
                                        {error.stack && <><p>
                                            コールスタック:
                                        </p>
                                            <pre className="pmwatch-error-boundary-msg">
                                                <code>{error.stack}</code>
                                            </pre></>}
                                        <p className="pmwatch-error-boundary-button-container">
                                            ページを再読み込みして再試行できます。<br />
                                            <a href="https://www.nicovideo.jp/video_top">
                                                ニコニコ動画へ戻る
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            );
                        }}
                    >
                        <ShogiBody />
                        <PluginList />
                    </ErrorBoundary>
                </ModalStateProvider>
            </StorageProvider>
        </StrictMode>
    );
}

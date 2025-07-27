import { createRef, StrictMode } from "react"
import { ModalStateProvider } from "../Global/Contexts/ModalStateProvider"
import { ErrorBoundary } from "react-error-boundary"
import { IconBoom } from "@tabler/icons-react"
import PluginList from "../Global/PluginList"
import "../Global/baseUI.css"
import.meta.glob("../Global/styleModules/**/*.css", { eager: true })
import RouterUI from "./RouterUI"
import { RouterProvider } from "./RouterContext"
import { VideoRefContext } from "../Global/Contexts/VideoDataProvider"
import { BackgroundPlayProvider } from "../Global/Contexts/BackgroundPlayProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MessageProvider } from "../Global/Contexts/MessageProvider"

const IVideoRef = createRef<HTMLVideoElement>()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: false,
            retryOnMount: false,
        },
    },
})

export default function RouterRoot() {
    return (
        <StrictMode>
            <ErrorBoundary
                fallbackRender={({ error }: { error: Error }) => {
                    return (
                        <div className="pmwatch-error-boundary-wrapper">
                            <div className="pmwatch-error-boundary-container">
                                <h1>
                                    <IconBoom />
                                    {" "}
                                    Aw, snap!
                                </h1>
                                <p>
                                    申し訳ありません。MintWatch の表示中に重大なエラーが発生しました。
                                    <br />
                                    この問題を開発者に Github もしくは Discord 経由で報告してください。
                                </p>
                                <p className="pmwatch-error-boundary-msg">
                                    <code>{error.message}</code>
                                </p>
                                {error.stack && (
                                    <>
                                        <p>
                                            コールスタック:
                                        </p>
                                        <pre className="pmwatch-error-boundary-msg">
                                            <code>{error.stack}</code>
                                        </pre>
                                    </>
                                )}
                                <p className="pmwatch-error-boundary-button-container">
                                    ページを再読み込みして再試行できます。
                                    <br />
                                    <a href="https://www.nicovideo.jp/video_top">
                                        ニコニコ動画へ戻る
                                    </a>
                                </p>
                            </div>
                        </div>
                    )
                }}
            >
                <StorageProvider>
                    <QueryClientProvider client={queryClient}>
                        <ModalStateProvider>
                            <VideoRefContext value={IVideoRef}>
                                <BackgroundPlayProvider>
                                    <MessageProvider>
                                        <RouterProvider>
                                            <RouterUI />
                                            <PluginList />
                                        </RouterProvider>
                                    </MessageProvider>
                                </BackgroundPlayProvider>
                            </VideoRefContext>
                        </ModalStateProvider>
                    </QueryClientProvider>
                </StorageProvider>
            </ErrorBoundary>
        </StrictMode>
    )
}

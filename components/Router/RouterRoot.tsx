import { createRef, StrictMode } from "react"
import { ModalStateProvider } from "../Global/Contexts/ModalStateProvider"
import { ErrorBoundary } from "react-error-boundary"
import PluginList from "../Global/PluginList"
import "../Global/baseUI.css"
import.meta.glob("../Global/styleModules/**/*.css", { eager: true })
import RouterUI from "./RouterUI"
import { RouterProvider } from "./RouterContext"
import { VideoRefContext } from "../Global/Contexts/VideoDataProvider"
import { BackgroundPlayProvider } from "../Global/Contexts/BackgroundPlayProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MessageProvider } from "../Global/Contexts/MessageProvider"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createExtensionStoragePersister } from "@/utils/extensionStoragePersister"
import { OutOfBounds } from "./OutOfBounds"

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

const persister = createExtensionStoragePersister()

export default function RouterRoot() {
    return (
        <StrictMode>
            <ErrorBoundary
                fallbackRender={OutOfBounds}
            >
                <StorageProvider>
                    <QueryClientProvider client={queryClient}>
                        <PersistQueryClientProvider
                            client={queryClient}
                            persistOptions={{
                                persister,
                                dehydrateOptions: {
                                    shouldDehydrateQuery: (query) => {
                                        if (query.queryKey[0] === "persistent") {
                                            return true
                                        }
                                        return false
                                    },
                                    shouldDehydrateMutation: () => false,
                                },
                            }}
                        >
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
                        </PersistQueryClientProvider>
                    </QueryClientProvider>
                </StorageProvider>
            </ErrorBoundary>
        </StrictMode>
    )
}

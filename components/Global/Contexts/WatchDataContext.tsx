import { createContext, Dispatch, ReactNode, SetStateAction } from "react"
import { VideoDataProvider } from "@/components/Global/Contexts/VideoDataProvider"
import { CommentDataProvider } from "@/components/Global/Contexts/CommentDataProvider"
import { PlaylistProvider } from "@/components/Global/Contexts/PlaylistProvider"
import { RecommendProvider } from "@/components/Global/Contexts/RecommendProvider"
import { useLocationContext } from "@/components/Router/RouterContext"
import { ViewerNgProvider } from "./ViewerNgProvider"

type smIdContext = {
    smId: null | string
    setSmId: Dispatch<SetStateAction<null | string>>
}
const ISmIdContext = createContext<smIdContext>({
    smId: null!,
    setSmId: null!,
})

export function SmIdProvider({ children }: { children: ReactNode }) {
    const location = useLocationContext()
    const [smId, setSmId] = useState<null | string>(
        location.pathname.startsWith("/watch/")
            ? location.pathname.replace("/watch/", "").replace(/\?.*/, "")
            : null,
    )
    return (
        <ISmIdContext value={{ smId, setSmId }}>
            {children}
        </ISmIdContext>
    )
}

export function WatchDataProvider({ children }: { children: ReactNode }) {
    return (
        <VideoDataProvider>
            <CommentDataProvider>
                <ViewerNgProvider>
                    <RecommendProvider>
                        <PlaylistProvider>
                            {children}
                        </PlaylistProvider>
                    </RecommendProvider>
                </ViewerNgProvider>
            </CommentDataProvider>
        </VideoDataProvider>
    )
}

export function useSmIdContext() {
    return useContext(ISmIdContext)
}

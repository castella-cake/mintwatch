import { createContext, ReactNode } from "react"
import { RecommendDataRootObject } from "@/types/RecommendData"
import { useRecommendData } from "@/hooks/apiHooks/watch/recommendData"
import { useVideoInfoContext } from "./VideoDataProvider"

const IRecommendContext = createContext<RecommendDataRootObject | undefined>(undefined)

export function RecommendProvider({ children }: { children: ReactNode }) {
    const { videoId } = useVideoInfoContext()

    const recommendData = useRecommendData(videoId)

    useEffect(() => {
        if (
            recommendData && recommendData.meta?.status === 200
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_recommendInformationReady", {
                    detail: JSON.stringify({ recommendData }),
                }),
            )
        }
    }, [recommendData])

    return (
        <IRecommendContext value={recommendData}>
            {children}
        </IRecommendContext>
    )
}

export function useRecommendContext() {
    return useContext(IRecommendContext)
}

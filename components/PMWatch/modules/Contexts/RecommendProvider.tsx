import { createContext, ReactNode } from "react";
import { useSmIdContext } from "../WatchDataContext";
import { RecommendDataRootObject } from "@/types/RecommendData";

const IRecommendContext = createContext<RecommendDataRootObject>(null!);

export function RecommendProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const recommendData = useRecommendData(smId);

    useEffect(() => {
        if (
            recommendData.meta?.status === 200
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_recommendInformationReady", {
                    detail: JSON.stringify({ recommendData }),
                }),
            );
        }
    }, [recommendData]);

    return (
        <IRecommendContext.Provider value={recommendData}>
            {children}
        </IRecommendContext.Provider>
    );
}

export function useRecommendContext() {
    return useContext(IRecommendContext);
}

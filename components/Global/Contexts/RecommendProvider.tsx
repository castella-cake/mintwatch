import { createContext, ReactNode } from "react";
import { useSmIdContext } from "./WatchDataContext";
import { RecommendDataRootObject } from "@/types/RecommendData";
import { useRecommendData } from "@/hooks/apiHooks/recommendData";

const IRecommendContext = createContext<RecommendDataRootObject | undefined>(undefined);

export function RecommendProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const recommendData = useRecommendData(smId);

    useEffect(() => {
        if (
            recommendData && recommendData.meta?.status === 200
        ) {
            document.dispatchEvent(
                new CustomEvent("pmw_recommendInformationReady", {
                    detail: JSON.stringify({ recommendData }),
                }),
            );
        }
    }, [recommendData]);

    return (
        <IRecommendContext value={recommendData}>
            {children}
        </IRecommendContext>
    );
}

export function useRecommendContext() {
    return useContext(IRecommendContext);
}

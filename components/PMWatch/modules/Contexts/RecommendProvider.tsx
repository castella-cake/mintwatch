import { createContext, ReactNode } from "react";
import { useSmIdContext } from "../WatchDataContext";
import { RecommendDataRootObject } from "@/types/RecommendData";

const IRecommendContext = createContext<RecommendDataRootObject>(null!);

export function RecommendProvider({ children }: { children: ReactNode }) {
    const { smId } = useSmIdContext();

    const recommendData = useRecommendData(smId);

    return (
        <IRecommendContext.Provider value={recommendData}>
            {children}
        </IRecommendContext.Provider>
    );
}

export function useRecommendContext() {
    return useContext(IRecommendContext);
}

import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useVideoInfoContext } from "./VideoDataProvider";
import { NgData } from "@/types/ngCommentsApiData";

const IViewerNgContext = createContext<{ ngData: NgData | null, setNgData: Dispatch<SetStateAction<NgData | null>> }>({ ngData: null, setNgData: () => {} });

export function ViewerNgProvider({ children }: { children: ReactNode }) {
    const {videoInfo} = useVideoInfoContext()
    const [ngData, setNgData] = useState<NgData | null>(videoInfo && videoInfo.data.response.comment.ng.viewer)
    return (
        <IViewerNgContext value={{ ngData, setNgData }}>
            {children}
        </IViewerNgContext>
    );
}

export function useViewerNgContext() {
    return useContext(IViewerNgContext);
}

import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useVideoInfoContext } from "./VideoDataProvider";
import { NgData } from "@/types/NgCommentsApiData";

const IViewerNgContext = createContext<{ ngData: NgData | undefined | null, setNgData: Dispatch<SetStateAction<NgData | undefined | null>> }>({ ngData: undefined, setNgData: () => {} });

export function ViewerNgProvider({ children }: { children: ReactNode }) {
    const {videoInfo} = useVideoInfoContext()
    const [ngData, setNgData] = useState<NgData | undefined | null>(videoInfo && videoInfo.data.response.comment.ng.viewer)
    useEffect(() => {
        if (!videoInfo) return;
        setNgData(videoInfo.data.response.comment.ng.viewer)
    }, [videoInfo])
    return (
        <IViewerNgContext value={{ ngData, setNgData }}>
            {children}
        </IViewerNgContext>
    );
}

export function useViewerNgContext() {
    return useContext(IViewerNgContext);
}

import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { VideoDataProvider } from "./Contexts/VideoDataProvider";
import { CommentDataProvider } from "./Contexts/CommentDataProvider";
import { PlaylistProvider } from "./Contexts/PlaylistProvider";
import { RecommendProvider } from "./Contexts/RecommendProvider";

type smIdContext = {
    smId: string;
    setSmId: Dispatch<SetStateAction<string>>;
};
const ISmIdContext = createContext<smIdContext>({
    smId: null!,
    setSmId: null!,
});

export function SmIdProvider({ children }: { children: ReactNode }) {
    const [smId, setSmId] = useState(
        location.pathname.slice(7).replace(/\?.*/, ""),
    );
    return (
        <ISmIdContext value={{ smId, setSmId }}>
            {children}
        </ISmIdContext>
    );
}

export function WatchDataProvider({ children }: { children: ReactNode }) {
    return (
        <VideoDataProvider>
            <CommentDataProvider>
                <RecommendProvider>
                    <PlaylistProvider>{children}</PlaylistProvider>
                </RecommendProvider>
            </CommentDataProvider>
        </VideoDataProvider>
    );
}

export function useSmIdContext() {
    return useContext(ISmIdContext);
}

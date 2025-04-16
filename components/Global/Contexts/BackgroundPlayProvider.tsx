import { createContext, createRef, Dispatch, ReactNode, RefObject, SetStateAction } from "react";

// playingのStateで視聴ページを保持し続けるかを管理し、refで戻る用のアドレスを保持し、backgroundInfoのStateでミニプレイヤーの情報を保持する
const IBackgroundPlayingContext = createContext<boolean>(false);
const ISetBackgroundPlayingContext = createContext<Dispatch<SetStateAction<boolean>>>(() => { });

type backgroundPlayingInfo = {
    videoId?: string,
    title?: string,
    thumbnailSrc?: string,
}
const IBackgroundPlayInfoContext = createContext<backgroundPlayingInfo>({});
const ISetBackgroundPlayInfoContext = createContext<Dispatch<SetStateAction<backgroundPlayingInfo>>>(() => { });

export const BackgroundPlayHrefRefContext = createContext<RefObject<string | null>>(createRef<string | null>());
const IBackgroundPlayHrefRef = createRef<string | null>();

export function BackgroundPlayProvider({ children }: { children: ReactNode }) {
    const [backgroundPlaying, setBackgroundPlaying] = useState<boolean>(false);
    const [backgroundPlayingInfo, setBackgroundPlayingInfo] = useState<backgroundPlayingInfo>({});

    return (
        <ISetBackgroundPlayingContext value={setBackgroundPlaying}>
            <IBackgroundPlayingContext value={backgroundPlaying}>
                <ISetBackgroundPlayInfoContext value={setBackgroundPlayingInfo}>
                    <IBackgroundPlayInfoContext value={backgroundPlayingInfo}>
                        <BackgroundPlayHrefRefContext value={IBackgroundPlayHrefRef}>
                            {children}
                        </BackgroundPlayHrefRefContext>
                    </IBackgroundPlayInfoContext>
                </ISetBackgroundPlayInfoContext>
            </IBackgroundPlayingContext>
        </ISetBackgroundPlayingContext>
    );
}

export function useBackgroundPlayingContext() {
    return useContext(IBackgroundPlayingContext);
}

export function useSetBackgroundPlayingContext() {
    return useContext(ISetBackgroundPlayingContext);
}

export function useBackgroundPlayInfoContext() {
    return useContext(IBackgroundPlayInfoContext);
}

export function useSetBackgroundPlayInfoContext() {
    return useContext(ISetBackgroundPlayInfoContext);
}

export function useBackgroundPlayHrefRefContext() {
    return useContext(BackgroundPlayHrefRefContext);
}
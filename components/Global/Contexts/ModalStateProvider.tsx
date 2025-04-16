import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

const IVideoModalStateContext = createContext<false | "mylist" | "share" | "help" | "shortcuts">(false);
const ISetVideoModalStateContext = createContext<Dispatch<SetStateAction<false | "mylist" | "share" | "help" | "shortcuts">>>(() => { });

const IHeaderActionStateContext = createContext<false | "notifications" | "mymenu">(false);
const ISetHeaderActionStateContext = createContext<Dispatch<SetStateAction<false | "notifications" | "mymenu">>>(null!);

const IMintConfigShownContext = createContext<boolean>(false);
const ISetMintConfigShownContext = createContext<Dispatch<SetStateAction<boolean>>>(() => { });

const ISideMenuShownContext = createContext<boolean>(false);
const ISetSideMenuShownContext = createContext<Dispatch<SetStateAction<boolean>>>(() => { });

export function ModalStateProvider({ children }: { children: ReactNode }) {
    const [videoActionModalState, setVideoActionModalState] = useState<
        false | "mylist" | "share" | "help" | "shortcuts"
    >(false);
    const [headerActionState, setHeaderActionState] = useState<
        false | "notifications" | "mymenu"
    >(false);
    const [mintConfigShown, setMintConfigShown] = useState(false);
    const [isSideMenuShown, setIsSideMenuShown] = useState(false);

    return (
        <ISetMintConfigShownContext value={setMintConfigShown}>
            <IMintConfigShownContext value={mintConfigShown}>
                <ISetHeaderActionStateContext value={setHeaderActionState}>
                    <IHeaderActionStateContext value={headerActionState}>
                        <ISetSideMenuShownContext value={setIsSideMenuShown}>
                            <ISideMenuShownContext value={isSideMenuShown}>
                                <ISetVideoModalStateContext value={setVideoActionModalState}>
                                    <IVideoModalStateContext value={videoActionModalState}>
                                        {children}
                                    </IVideoModalStateContext>
                                </ISetVideoModalStateContext>
                            </ISideMenuShownContext>
                        </ISetSideMenuShownContext>
                    </IHeaderActionStateContext>
                </ISetHeaderActionStateContext>
            </IMintConfigShownContext>
        </ISetMintConfigShownContext>
    );
}

export function useVideoActionModalStateContext() {
    return useContext(IVideoModalStateContext);
}

export function useSetVideoActionModalStateContext() {
    return useContext(ISetVideoModalStateContext);
}

export function useHeaderActionStateContext() {
    return useContext(IHeaderActionStateContext);
}

export function useSetHeaderActionStateContext() {
    return useContext(ISetHeaderActionStateContext);
}

export function useMintConfigShownContext() {
    return useContext(IMintConfigShownContext);
}

export function useSetMintConfigShownContext() {
    return useContext(ISetMintConfigShownContext);
}

export function useSideMenuShownContext() {
    return useContext(ISideMenuShownContext);
}

export function useSetSideMenuShownContext() {
    return useContext(ISetSideMenuShownContext);
}
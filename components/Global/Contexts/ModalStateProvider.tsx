import { createContext, Dispatch, ReactNode, SetStateAction } from "react"

type videoModalState = false | "mylist" | "share" | "ngcomments" | "taginfo"

const IVideoModalStateContext = createContext<videoModalState>(false)
const ISetVideoModalStateContext = createContext<Dispatch<SetStateAction<videoModalState>>>(() => { })

type HeaderActionState = false | "notifications" | "mymenu" | "activities"

const IHeaderActionStateContext = createContext<HeaderActionState>(false)
const ISetHeaderActionStateContext = createContext<Dispatch<SetStateAction<HeaderActionState>>>(null!)

type MintConfigState = false | "quick" | "settings" | "help" | "shortcuts" | "whatsnew" | "about"
type HighlightedSettingKeyState = string | null

const IMintConfigShownContext = createContext<MintConfigState>(false)
const ISetMintConfigShownContext = createContext<Dispatch<SetStateAction<MintConfigState>>>(() => { })

const IHighlightedSettingKeyContext = createContext<HighlightedSettingKeyState>(null)
const ISetHighlightedSettingKeyContext = createContext<Dispatch<SetStateAction<HighlightedSettingKeyState>>>(() => { })

const ISideMenuShownContext = createContext<boolean>(false)
const ISetSideMenuShownContext = createContext<Dispatch<SetStateAction<boolean>>>(() => { })

export function ModalStateProvider({ children }: { children: ReactNode }) {
    const [videoActionModalState, setVideoActionModalState] = useState<videoModalState>(false)
    const [headerActionState, setHeaderActionState] = useState<HeaderActionState>(false)
    const [mintConfigShown, setMintConfigShown] = useState<MintConfigState>(false)
    const [highlightedSettingKey, setHighlightedSettingKey] = useState<HighlightedSettingKeyState>(null)
    const [isSideMenuShown, setIsSideMenuShown] = useState(false)

    return (
        <ISetMintConfigShownContext value={setMintConfigShown}>
            <IMintConfigShownContext value={mintConfigShown}>
                <ISetHighlightedSettingKeyContext value={setHighlightedSettingKey}>
                    <IHighlightedSettingKeyContext value={highlightedSettingKey}>
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
                    </IHighlightedSettingKeyContext>
                </ISetHighlightedSettingKeyContext>
            </IMintConfigShownContext>
        </ISetMintConfigShownContext>
    )
}

export function useVideoActionModalStateContext() {
    return useContext(IVideoModalStateContext)
}

export function useSetVideoActionModalStateContext() {
    return useContext(ISetVideoModalStateContext)
}

export function useHeaderActionStateContext() {
    return useContext(IHeaderActionStateContext)
}

export function useSetHeaderActionStateContext() {
    return useContext(ISetHeaderActionStateContext)
}

export function useMintConfigShownContext() {
    return useContext(IMintConfigShownContext)
}

export function useSetMintConfigShownContext() {
    return useContext(ISetMintConfigShownContext)
}

export function useSideMenuShownContext() {
    return useContext(ISideMenuShownContext)
}

export function useSetSideMenuShownContext() {
    return useContext(ISetSideMenuShownContext)
}

export function useHighlightedSettingKeyContext() {
    return useContext(IHighlightedSettingKeyContext)
}

export function useSetHighlightedSettingKeyContext() {
    return useContext(ISetHighlightedSettingKeyContext)
}

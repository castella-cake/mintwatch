import { createBrowserHistory, History, Location } from "history"
import { createContext, ReactNode, useLayoutEffect } from "react"

const IHistoryContext = createContext<History | null>(null)
const ILocationContext = createContext<Location | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
    const syncStorage = useStorageVar(["enableReshogi"] as const)
    const targetPathnames = syncStorage.enableReshogi ? ["/watch/", "/ranking"] : ["/watch/"]

    const historyRef = useRef<History | null>(null)
    if (!historyRef.current) historyRef.current = createBrowserHistory()
    const [location, setLocation] = useState(historyRef.current?.location)
    useLayoutEffect(() => {
        if (historyRef.current) {
            return historyRef.current.listen(({ location }) => {
                setLocation(location)
                if (!targetPathnames.some(path => location.pathname.startsWith(path))) {
                    window.location.href = "https://www.nicovideo.jp" + location.pathname + location.search
                }
            })
        }
    }, [])
    return (
        <IHistoryContext value={historyRef.current}>
            <ILocationContext value={location}>
                {children}
            </ILocationContext>
        </IHistoryContext>
    )
}

export function useHistoryContext() {
    return useContext(IHistoryContext)!
}

export function useLocationContext() {
    return useContext(ILocationContext)!
}

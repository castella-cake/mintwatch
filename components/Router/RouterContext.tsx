import { createBrowserHistory, History, Location } from "history"
import { createContext, ReactNode, useLayoutEffect } from "react"

const IHistoryContext = createContext<History | null>(null)
const ILocationContext = createContext<Location | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
    const historyRef = useRef<History | null>(null)
    if (!historyRef.current) historyRef.current = createBrowserHistory()
    const [location, setLocation] = useState(historyRef.current?.location)
    useLayoutEffect(() => {
        if (historyRef.current) {
            return historyRef.current.listen(({ location }) => setLocation(location))
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

import { SmIdProvider, WatchDataProvider } from "../Global/Contexts/WatchDataContext"
import CreateWatchUI from "./WatchUI"
import "./watchUI.css"
import.meta.glob("./styleModules/**/*.css", { eager: true })

export function WatchBody() {
    return (
        <SmIdProvider>
            <WatchDataProvider>
                <CreateWatchUI />
            </WatchDataProvider>
        </SmIdProvider>
    )
}

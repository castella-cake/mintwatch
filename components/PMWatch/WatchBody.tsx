import { SmIdProvider, WatchDataProvider } from "../Global/Contexts/WatchDataContext";
import CreateWatchUI from "./WatchUI";
import "./watchUI.styl"
import.meta.glob("./styleModules/**/*.styl", {eager: true})

export function WatchBody({}) {
    return <SmIdProvider>
        <WatchDataProvider>
            <CreateWatchUI />
        </WatchDataProvider>
    </SmIdProvider>
}
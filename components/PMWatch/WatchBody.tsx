import { SmIdProvider, WatchDataProvider } from "./modules/WatchDataContext";
import CreateWatchUI from "./WatchUI";

export function WatchBody({}) {
    return <SmIdProvider>
        <WatchDataProvider>
            <CreateWatchUI />
        </WatchDataProvider>
    </SmIdProvider>
}
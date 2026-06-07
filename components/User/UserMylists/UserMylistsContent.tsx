import { Match } from "@/components/Router/RouterUI"
import { UserMylistsList } from "./UserMylistsList"
import { UserMylist } from "./UserMylist"
import "../styles/UserMylists.css"

export function UserMylistsContent() {
    return (
        <div className="user-mylists-container">
            <div className="user-mylists-left">
                <UserMylistsList showRootAnchor />
            </div>
            <div className="user-mylists-body">
                <Match targetPathname={[
                    "/my/mylist!",
                ]}
                >
                    <UserMylistsList showSampleItems />
                </Match>
                <Match targetPathname={[
                    "/my/mylist/:",
                ]}
                >
                    <UserMylist />
                </Match>
            </div>
        </div>
    )
}

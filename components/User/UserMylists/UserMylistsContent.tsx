import { Match } from "@/components/Router/RouterUI"
import { UserMylistsList } from "./UserMylistsList"
import { UserMylist } from "./UserMylist"
import { UserMylistByMe } from "./UserMylistByMe"
import "../styles/UserMylists.css"

export function UserMylistsContent({ userId, isMyPage }: { userId?: number, isMyPage?: boolean }) {
    if (!userId && !isMyPage) return

    return (
        <div className="user-mylists-container">
            <div className="user-mylists-left">
                <UserMylistsList showRootAnchor userId={userId} />
            </div>
            <div className="user-mylists-body">
                <Match targetPathname={isMyPage
                    ? [
                            "/my/mylist!",
                        ]
                    : [
                            `/user/${userId}/mylist!`,
                        ]}
                >
                    <UserMylistsList showSampleItems userId={userId} />
                </Match>
                { !isMyPage && (
                    <Match targetPathname={[
                        `/user/${userId}/mylist/:`,
                    ]}
                    >
                        <UserMylist userId={userId} />
                    </Match>
                )}
                { isMyPage && (
                    <Match targetPathname={[
                        "/my/mylist/:",
                    ]}
                    >
                        <UserMylistByMe />
                    </Match>
                )}
            </div>
        </div>
    )
}

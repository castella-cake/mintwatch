import { useInfiniteUserFollowedByData } from "@/hooks/apiHooks/user/infinityUserFollowedByData"
import { FollowUserItemCard } from "./FollowUserItemCard"
import { useInView } from "react-intersection-observer"

export function FollowedByUsers({ userId }: { userId: "me" | number }) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteUserFollowedByData(userId)
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    if (isLoading) {
        return (
            <div className="user-followedby-users-loading">
                フォロワーを取得中
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-followedby-users-error">
                フォロワーの取得に失敗しました
            </div>
        )
    }

    return (
        <div className="user-followedby-users">
            {data?.pages.flatMap(page => page.data.items).map(user => (
                <FollowUserItemCard key={user.id} user={user} />
            ))}
            <div ref={ref} className="user-followedby-users-inview-anchor">
                {isFetchingNextPage && <p>Loading...</p>}
            </div>
        </div>
    )
}

import { useInfiniteUserFollowingsData } from "@/hooks/apiHooks/user/infinityUserFollowingsData"
import { OptionSelector } from "@/components/Global/OptionSelector/OptionSelector"
import { useInView } from "react-intersection-observer"
import { FollowUserItemCard } from "./FollowUserItemCard"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function FollowingUsers({ userId }: { userId: "me" | number }) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteUserFollowingsData(userId)
    const { ref, inView } = useInView()
    const { followUsersGridLayout } = useStorageVar(["followUsersGridLayout"], "local")
    const isGridLayout = followUsersGridLayout ?? false

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    if (isLoading) {
        return <LoadingFiller />
    }

    if (error) {
        return (
            <div className="user-following-users-error">
                フォロー中のユーザーの取得に失敗しました
            </div>
        )
    }

    const items = data?.pages.flatMap(page => page.data.items) ?? []

    return (
        <>
            <OptionSelector gridSwitcherEnabled={isGridLayout} onLayoutSwitch={(enabled) => { storage.setItem("local:followUsersGridLayout", enabled) }} />
            <div className="user-following-users" data-is-grid-layout={isGridLayout}>
                { items.length === 0
                    ? <EmptyNotice contentName="フォロー中のユーザー" />
                    : items.map(user => (
                            <FollowUserItemCard key={user.id} user={user} isVerticalLayout={isGridLayout} />
                        )) }
                <div ref={ref} className="user-following-users-inview-anchor">
                    {isFetchingNextPage && <LoadingFiller compact />}
                </div>
            </div>
        </>
    )
}

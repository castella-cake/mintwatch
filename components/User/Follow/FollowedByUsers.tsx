import { useInfiniteUserFollowedByData } from "@/hooks/apiHooks/user/infinityUserFollowedByData"
import { OptionSelector } from "@/components/Global/OptionSelector/OptionSelector"
import { FollowUserItemCard } from "./FollowUserItemCard"
import { useInView } from "react-intersection-observer"
import { LoadingFiller } from "@/components/Global/LoadingFiller"
import { EmptyNotice } from "@/components/Global/EmptyNotice"

export function FollowedByUsers({ userId }: { userId: "me" | number }) {
    const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteUserFollowedByData(userId)
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
            <div className="user-followedby-users-error">
                フォロワーの取得に失敗しました
            </div>
        )
    }

    const items = data?.pages.flatMap(page => page.data.items) ?? []

    return (
        <>
            <OptionSelector gridSwitcherEnabled={isGridLayout} onLayoutSwitch={(enabled) => { storage.setItem("local:followUsersGridLayout", enabled) }} />
            <div className="user-followedby-users" data-is-grid-layout={isGridLayout}>
                { items.length === 0
                    ? <EmptyNotice contentName="フォロワー" />
                    : items.map(user => (
                            <FollowUserItemCard key={user.id} user={user} isVerticalLayout={isGridLayout} />
                        )) }
                <div ref={ref} className="user-followedby-users-inview-anchor">
                    {isFetchingNextPage && <LoadingFiller compact />}
                </div>
            </div>
        </>
    )
}

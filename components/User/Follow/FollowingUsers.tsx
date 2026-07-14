import { useUserFollowingsData } from "@/hooks/apiHooks/user/UserFollowingsData"
import { FollowUserItemCard } from "./FollowUserItemCard"

export function FollowingUsers({ userId }: { userId: "me" | number }) {
    const { data, error, isLoading } = useUserFollowingsData(userId, 20)

    if (isLoading) {
        return (
            <div className="user-following-users-loading">
                フォロー中のユーザーを取得中
            </div>
        )
    }

    if (error) {
        return (
            <div className="user-following-users-error">
                フォロー中のユーザーの取得に失敗しました
            </div>
        )
    }

    return (
        <div className="user-following-users">
            {data?.data.items.map(user => (
                <FollowUserItemCard key={user.id} user={user} />
            ))}
        </div>
    )
}

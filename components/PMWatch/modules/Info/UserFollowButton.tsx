import { useQuery } from "@tanstack/react-query"
import { IconCheck, IconProgressHelp, IconStar } from "@tabler/icons-react"
import { useUserFollowOperation } from "@/hooks/apiHooks/user/userFollow"

export default function UserFollowButton({ userId }: { userId: string | number }) {
    const { mutate, isPending } = useUserFollowOperation()
    const { data: isFollowing, isLoading } = useQuery({
        queryKey: ["userFollow", userId],
        queryFn: () => userFollowApi(userId, "GET").then(response => response.data?.following ?? false),
    })

    if (isLoading) return (
        <button className="videoinfo-owner-followbtn">
            <IconProgressHelp />
            <br />
            <span>ロード中</span>
        </button>
    )

    return (
        <button
            className="videoinfo-owner-followbtn"
            title={isFollowing ? "フォロー解除" : "フォロー"}
            onClick={() => mutate({ userId, follow: isFollowing ?? false })}
            disabled={isPending}
        >
            {isFollowing ? <IconCheck /> : <IconStar />}
            <br />
            <span>{isFollowing ? "フォロー中" : "フォロー"}</span>
        </button>
    )
}

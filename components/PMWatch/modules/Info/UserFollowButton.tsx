import { UserFollowApiDataRootObject } from "@/types/UserFollowApiData"
import { IconCheck, IconProgressHelp, IconStar } from "@tabler/icons-react"

export default function UserFollowButton({ userId }: { userId: string | number }) {
    const [isFollowingData, setIsFollowingData] = useState<{ following: boolean, userId: string | number } | null>(null)
    useEffect(() => {
        async function getFollowStatus() {
            // 同じユーザーIDだったらfetchをスキップ(無駄なので)
            if (isFollowingData && isFollowingData.userId === userId) return

            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "GET")
            if (response.data && response.data.following) {
                setIsFollowingData({ following: true, userId })
            } else {
                setIsFollowingData({ following: false, userId })
            }
        }
        getFollowStatus()
    }, [userId])

    async function onFollowClick() {
        if (isFollowingData && isFollowingData.following) {
            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "DELETE")
            if (response.meta.status === 200) setIsFollowingData({ following: false, userId })
        } else {
            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "POST")
            if (response.meta.status === 200) setIsFollowingData({ following: true, userId })
        }
    }

    if (isFollowingData === null) return (
        <button className="videoinfo-owner-followbtn">
            <IconProgressHelp />
            <br />
            <span>ロード中</span>
        </button>
    )

    return (
        <button className="videoinfo-owner-followbtn" title={isFollowingData.following ? "フォロー解除" : "フォロー"} onClick={onFollowClick}>
            {isFollowingData.following ? <IconCheck /> : <IconStar />}
            <br />
            <span>{isFollowingData.following ? "フォロー中" : "フォロー"}</span>
        </button>
    )
}

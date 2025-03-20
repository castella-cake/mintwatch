import { UserFollowApiDataRootObject } from "@/types/UserFollowApiData";
import { IconCheck, IconProgressHelp, IconStar} from "@tabler/icons-react";

export default function UserFollowButton({ userId }: { userId: string | number }) {
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    useEffect(() => {
        async function getFollowStatus() {
            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "GET");
            if (response.data && response.data.following) {
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
            }
        }
        getFollowStatus();
    }, [])

    async function onFollowClick() {
        if (isFollowing) {
            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "DELETE");
            if ( response.meta.status === 200 ) setIsFollowing(false);
        } else {
            const response: UserFollowApiDataRootObject = await userFollowApi(userId, "POST");
            if ( response.meta.status === 200 ) setIsFollowing(true);
        }
    }

    if (isFollowing === null) return <button className="videoinfo-owner-followbtn">
        <IconProgressHelp/>
        <br/>
        <span>ロード中</span>
    </button>

    return <button className="videoinfo-owner-followbtn" title={isFollowing ? "フォロー解除" : "フォロー"} onClick={onFollowClick}>
        {isFollowing ? <IconCheck/> : <IconStar/>}
        <br/>
        <span>{isFollowing ? "フォロー中" : "フォロー"}</span>
    </button>
}
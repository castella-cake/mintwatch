import { useMylistFollowOperation } from "@/hooks/apiHooks/user/mylistFollow"
import { IconCheck, IconStar } from "@tabler/icons-react"
import { MylistManageMenu } from "./MylistManageMenu"

export function UserMylistHeader({ mylistData, showFollowButton = false, showManageMenu = false }: { mylistData: UserMylistResponseRootObject | undefined, showFollowButton?: boolean, showManageMenu?: boolean }) {
    // Rules of Hooks: 早期returnより前にフックを呼ぶ
    const { mutate, isPending } = useMylistFollowOperation()
    if (!mylistData) return
    const mylist = mylistData.data.mylist
    const handleFollow = () => {
        mutate({ mylistId: mylist.id, mylistName: mylist.name, follow: !mylist.isFollowing })
    }
    return (
        <div className="user-videolist-view-information">
            <div className="user-videolist-view-information-data">
                <div className="user-videolist-view-information-titleline">
                    <h2 className="user-videolist-view-title">{mylist.name}</h2>
                    { showFollowButton && (
                        <button
                            type="button"
                            className="user-videolist-view-follow-button"
                            data-is-active={mylist.isFollowing}
                            disabled={isPending}
                            onClick={handleFollow}
                        >
                            {mylist.isFollowing ? <IconCheck /> : <IconStar />}
                            <span>
                                {mylist.isFollowing ? "フォロー中" : "フォロー"}
                            </span>
                        </button>
                    )}
                    { showManageMenu && <MylistManageMenu mylist={mylist} /> }
                </div>
                <div className="user-videolist-view-stats">
                    <div className="user-videolist-view-stat">
                        全
                        {" "}
                        <strong>{mylist.totalItemCount}</strong>
                        {" "}
                        件
                    </div>
                    <div className="user-videolist-view-stat">
                        {mylist.isPublic ? "公開" : "非公開"}
                    </div>
                    <div className="user-videolist-view-stat">
                        フォロワー
                        {" "}
                        <strong>{mylist.followerCount}</strong>
                    </div>
                </div>
                { mylist.description && (
                    <div className="user-videolist-view-description">
                        {mylist.description}
                    </div>
                )}
            </div>
        </div>
    )
}

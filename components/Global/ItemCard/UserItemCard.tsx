import { SearchUserItem } from "@/types/search/userData"
import { IconCheck, IconStar } from "@tabler/icons-react"
import { useUserFollowOperation } from "@/hooks/apiHooks/user/userFollow"
import { useId } from "react"
import "./styles/userItem.css"

export function UserItemCard({ user, markAsLazy, isVerticalLayout, ...additionalAttributes }: { user: SearchUserItem, markAsLazy?: boolean, isVerticalLayout?: boolean }) {
    const isFollowing = user.relationships.sessionUser.isFollowing
    const { mutate, isPending } = useUserFollowOperation()
    const nicknameId = useId()
    const descriptionId = useId()

    return (
        <div className="useritem-card" key={user.id} data-layout={isVerticalLayout ? "vertical-simple" : undefined} data-is-following={isFollowing} {...additionalAttributes}>
            <a
                className="useritem-card-link"
                href={userIdToUserUrl(user.id.toString())}
                aria-labelledby={nicknameId}
                aria-describedby={user.strippedDescription.length > 0 ? descriptionId : undefined}
            />
            <img className="useritem-icon" src={user.icons.large} loading={markAsLazy ? "lazy" : undefined} />
            <div className="useritem-datacolumn">
                <div className="useritem-nickname" id={nicknameId}>
                    {user.nickname}
                </div>
                {user.strippedDescription.length > 0 && (
                    <div className="useritem-strippeddesc" id={descriptionId}>
                        {user.strippedDescription}
                    </div>
                )}
                <div className="useritem-count-container">
                    <span className="useritem-count-item">
                        <span className="useritem-count-label">フォロワー</span>
                        {" "}
                        <strong>{user.followerCount}</strong>
                    </span>
                    <span className="useritem-count-item">
                        <span className="useritem-count-label">動画</span>
                        {" "}
                        <strong>{user.videoCount}</strong>
                    </span>
                    <span className="useritem-count-item">
                        <span className="useritem-count-label">番組</span>
                        {" "}
                        <strong>
                            {user.liveCount}
                        </strong>
                    </span>
                </div>
            </div>
            <button
                type="button"
                className="useritem-followbutton"
                data-is-following={isFollowing}
                onClick={() => mutate({ userId: user.id, nickname: user.nickname, follow: !isFollowing })}
                disabled={isPending}
            >
                { isFollowing ? <IconCheck /> : <IconStar /> }
                <span>
                    {isFollowing ? "フォロー解除" : "フォロー" }
                </span>
            </button>
        </div>
    )
}

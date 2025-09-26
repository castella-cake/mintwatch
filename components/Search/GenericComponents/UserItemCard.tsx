import { SearchUserItem } from "@/types/search/userData"
import "./styles/userItem.css"

export function UserItemCard({ user, markAsLazy }: { user: SearchUserItem, markAsLazy?: boolean }) {
    return (
        <a className="useritem-wrapper" key={user.id} href={userIdToUserUrl(user.id.toString())}>
            <img className="useritem-icon" src={user.icons.large} loading={markAsLazy ? "lazy" : undefined} />
            <div className="useritem-datacolumn">
                <div className="useritem-nickname">
                    {user.nickname}
                </div>
                {user.strippedDescription.length > 0 && (
                    <div className="useritem-strippeddesc">
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

        </a>
    )
}

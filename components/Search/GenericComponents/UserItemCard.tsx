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
                <div className="useritem-strippeddesc">
                    {user.strippedDescription}
                </div>
                <div className="useritem-count">
                    <span>
                        フォロワー
                        {" "}
                        <strong>{user.followerCount}</strong>
                    </span>
                    <span>
                        動画
                        {" "}
                        <strong>{user.videoCount}</strong>
                    </span>
                    <span>
                        番組
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

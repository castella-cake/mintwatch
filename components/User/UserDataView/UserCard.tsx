import { GenericUserData } from "@/types/user/genericUserData"
import "../styles/UserCard.css"
import { SnsLinks } from "./SnsLinks"

interface UserCardProps {
    userData: GenericUserData
    isMe?: boolean
}

export function UserCard({ userData, isMe = false }: UserCardProps) {
    return (
        <div className="usercard-container">
            <img src={userData.icons.large} alt={userData.nickname} className="usercard-icon" />
            <div className="usercard-info">
                <h2 className="usercard-nickname">
                    {userData.nickname}
                    {isMe && <span className="usercard-badge-me">あなた</span>}
                </h2>
                <div className="usercard-stats">
                    <span className="usercard-stat">
                        <strong>
                            {userData.followeeCount}
                        </strong>
                        {" "}
                        フォロー中
                    </span>
                    <span className="usercard-stat">
                        <strong>
                            {userData.followerCount}
                        </strong>
                        {" "}
                        フォロワー
                    </span>
                    {userData.isPremium && <span className="usercard-badge-premium">プレミアム</span>}
                </div>
                <div className="usercard-description">
                    {userData.decoratedDescriptionHtml
                        ? (
                                <div dangerouslySetInnerHTML={{ __html: userData.decoratedDescriptionHtml }} />
                            )
                        : (
                                <p>{userData.strippedDescription || "説明はありません"}</p>
                            )}
                </div>
            </div>
            <div className="usercard-bottominfo">
                <SnsLinks sns={userData.sns} />
            </div>
        </div>
    )
}

import { GenericUserData } from "@/types/user/genericUserData"
import { usePinnedAchievedHistoryData } from "@/hooks/apiHooks/user/achievedHistoryData"
import { honorClassConfig } from "../GenericComponents/achievementConfig"
import "../styles/UserCard.css"
import { SnsLinks } from "./SnsLinks"

interface UserCardProps {
    userData: GenericUserData
    userId: number
    isMe?: boolean
}

export function UserCard({ userData, userId, isMe = false }: UserCardProps) {
    const { pinnedAchievedHistoryData } = usePinnedAchievedHistoryData(userId)
    const pinnedItem = pinnedAchievedHistoryData?.data.user_achieved_history

    return (
        <div className="usercard-container" data-is-me={isMe}>
            <img src={userData.icons.large} alt={userData.nickname} className="usercard-icon" />
            <div className="usercard-info">
                <h2 className="usercard-title">
                    <div className="usercard-nickname">
                        {userData.nickname}
                    </div>
                    <SnsLinks sns={userData.sns} />
                </h2>
                <div className="usercard-stats">
                    <span className="usercard-stat">
                        ID:
                        {" "}
                        {userData.id}
                        {" "}
                        {userData.registeredVersion}
                    </span>
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
                    {userData.isPremium && <span className="usercard-badge-premium">プレミアム会員</span>}
                    {pinnedItem && (
                        <a
                            className="usercard-stat-pinned-achievement"
                            href={isMe ? "/my/achievement" : `/user/${userId}/achievement`}
                            data-honor-class={pinnedItem.achievement.honor_class}
                        >
                            {(() => {
                                const Icon = honorClassConfig[pinnedItem.achievement.honor_class].icon
                                return <Icon aria-hidden="true" />
                            })()}
                            <span>{pinnedItem.achievement.name}</span>
                        </a>
                    )}
                </div>
                <div className="usercard-description">
                    {userData.decoratedDescriptionHtml
                        ? (
                                <div dangerouslySetInnerHTML={{ __html: userData.decoratedDescriptionHtml }} />
                            )
                        : (
                                <div>{userData.strippedDescription || <span className="usercard-description-nothing">説明はありません</span>}</div>
                            )}
                </div>
            </div>
        </div>
    )
}

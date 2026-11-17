import { GenericUserData } from "@/types/user/genericUserData"
import { UserCard } from "./UserCard"
import "../styles/GenericUserDataView.css"
import { UserLevel } from "./UserLevel"
import { useUserFollowOperation } from "@/hooks/apiHooks/user/userFollow"

interface GenericUserDataViewProps {
    userData: GenericUserData
    userId: number
    isMe?: boolean
    isFollowing?: boolean
}

export function GenericUserDataView({ userData, userId, isMe = false, isFollowing = false }: GenericUserDataViewProps) {
    const { mutate, isPending } = useUserFollowOperation()

    return (
        <div className="userdata-container">
            <div className="userdata-user">
                <UserCard userData={userData} isMe={isMe} />
            </div>

            {userData.coverImage && (
                <div className="userdata-landscape">
                    <img src={userData.coverImage.pcUrl} alt="カバー画像" />
                </div>
            )}

            <div className="userdata-action">
                <div className="userdata-action-buttons">
                    { !isMe && (
                        <>
                            <button
                                type="button"
                                className="userdata-action-button"
                                data-action-type="follow"
                                data-is-active={isFollowing}
                                onClick={() => mutate({ userId, nickname: userData.nickname, follow: !isFollowing })}
                                disabled={isPending}
                            >
                                { isFollowing ? "フォロー中" : "フォローする" }
                            </button>
                            <a
                                href={`https://creator-support.nicovideo.jp/registration/${userData.id}`}
                                className="userdata-action-button"
                                data-action-type="support"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                サポートする
                            </a>
                        </>
                    )}
                </div>
                <UserLevel userLevel={userData.userLevel} />
            </div>
        </div>
    )
}

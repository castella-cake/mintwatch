import { GenericUserData } from "@/types/user/genericUserData"
import { UserCard } from "./UserCard"
import "../styles/GenericUserDataView.css"
import { UserLevel } from "./UserLevel"

interface GenericUserDataViewProps {
    userData: GenericUserData
    isMe?: boolean
}

export function GenericUserDataView({ userData, isMe = false }: GenericUserDataViewProps) {
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
                <button type="button" className="userdata-action-button" aria-disabled="true">
                    フォローする
                </button>
                <button type="button" className="userdata-action-button" aria-disabled="true">
                    サポートする
                </button>
                <UserLevel userLevel={userData.userLevel} />
            </div>
        </div>
    )
}

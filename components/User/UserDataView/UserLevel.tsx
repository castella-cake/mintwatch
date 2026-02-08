import "../styles/UserLevel.css"

export function UserLevel({ userLevel }: { userLevel: GenericUserData["userLevel"] }) {
    return (
        <div className="user-level">
            <div>
                LV
                {" "}
                {userLevel.currentLevel}
                {" / 次のレベルまで "}
                {userLevel.nextLevelExperience}
                {" "}
                XP
            </div>
            <div className="userdata-progress-bar">
                <div
                    className="userdata-progress-fill"
                    style={{
                        width: `${
                            (userLevel.currentLevelExperience
                                / userLevel.nextLevelThresholdExperience)
                            * 100
                        }%`,
                    }}
                />
            </div>
        </div>
    )
}

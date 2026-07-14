import { FollowUserItem } from "@/types/user/followingUserData"

export function FollowUserItemCard({ user, markAsLazy, isVerticalLayout, ...additionalAttributes }: { user: FollowUserItem, markAsLazy?: boolean, isVerticalLayout?: boolean }) {
    return (
        <a className="useritem-card" key={user.id} href={userIdToUserUrl(user.id.toString())} data-layout={isVerticalLayout ? "vertical-simple" : undefined} {...additionalAttributes}>
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
            </div>

        </a>
    )
}

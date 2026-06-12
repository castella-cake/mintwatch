export function UserMylistHeader({ mylistData }: { mylistData: UserMylistResponseRootObject | undefined }) {
    if (!mylistData) return
    return (
        <div className="user-videolist-view-information">
            <div className="user-videolist-view-information-data">
                <h2 className="user-videolist-view-title">{mylistData?.data.mylist.name}</h2>
                <div className="user-videolist-view-stats">
                    <div className="user-videolist-view-stat">
                        全
                        {" "}
                        <strong>{mylistData?.data.mylist.totalItemCount}</strong>
                        {" "}
                        件
                    </div>
                    <div className="user-videolist-view-stat">
                        {mylistData?.data.mylist.isPublic ? "公開" : "非公開"}
                    </div>
                    <div className="user-videolist-view-stat">
                        フォロワー
                        {" "}
                        <strong>{mylistData?.data.mylist.followerCount}</strong>
                    </div>
                </div>
                { mylistData?.data.mylist.description && (
                    <div className="user-videolist-view-description">
                        {mylistData?.data.mylist.description}
                    </div>
                )}
            </div>
        </div>
    )
}

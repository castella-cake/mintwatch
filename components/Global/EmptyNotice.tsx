export function EmptyNotice({ contentName }: { contentName: string }) {
    return (
        <div className="empty-notice-container">
            <p>{`${contentName}はありません`}</p>
        </div>
    )
}

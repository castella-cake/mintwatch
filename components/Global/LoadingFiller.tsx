export function LoadingFiller({ compact }: { compact?: boolean }) {
    return (
        <div className="loading-container" data-compact={compact || undefined}>
            <div className="loading-spinner" />
            <p>
                Loading...
            </p>
        </div>
    )
}

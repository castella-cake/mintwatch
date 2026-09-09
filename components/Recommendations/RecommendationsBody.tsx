import RecommendationsContent from "./RecommendationsContent"
import { useLocationContext } from "../Router/RouterContext"
import { HistoryAnchor } from "../Router/HistoryAnchor"
import { PageTopButton } from "../Global/PageTopButton"
import.meta.glob("./styleModules/**/*.css", { eager: true })

export function RecommendationsBody() {
    const location = useLocationContext()
    return (
        <div className="container recommendations-container">
            <div className="recommendations-type-selector">
                <HistoryAnchor
                    className="recommendations-type-selector-button"
                    data-is-active={location.pathname === "/recommendations" || location.pathname.startsWith("/recommendations?")}
                    href="/recommendations"
                >
                    おすすめの動画
                </HistoryAnchor>
            </div>
            <RecommendationsContent />
            <PageTopButton isLabelShown={false} isFixed={true} />
        </div>
    )
}

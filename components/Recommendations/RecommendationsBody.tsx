import RecommendationsContent from "./RecommendationsContent"
import { PageTopButton } from "../Global/PageTopButton"
import.meta.glob("./styleModules/**/*.css", { eager: true })

export function RecommendationsBody() {
    return (
        <div className="container recommendations-container">
            <RecommendationsContent />
            <PageTopButton isLabelShown={false} isFixed={true} />
        </div>
    )
}

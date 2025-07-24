import { useLocationContext } from "../Router/RouterContext"
import CustomRankingContent from "./CustomRanking"
import ForYouRankingContent from "./ForYouRanking"
import GenreRankingContent from "./GenreRanking"

export default function ShogiContent() {
    const location = useLocationContext()
    return (
        <div className="shogi-content">
            {location.pathname.startsWith("/ranking/custom") && <CustomRankingContent />}
            {location.pathname.startsWith("/ranking/genre") && <GenreRankingContent />}
            {location.pathname.startsWith("/ranking/for_you") && <ForYouRankingContent />}
        </div>
    )
}

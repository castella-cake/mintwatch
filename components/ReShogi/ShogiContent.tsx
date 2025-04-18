import { useLocationContext } from "../Router/RouterContext";
import CustomRankingContent from "./CustomRanking";
import GenreRankingContent from "./GenreRanking";

export default function ShogiContent() {
    const location = useLocationContext()
    return (
        <div className="shogi-content">
            {location.pathname.replace(/\?.*/, "") === "/ranking" && <CustomRankingContent/>}
            {location.pathname.startsWith("/ranking/genre") && <GenreRankingContent/>}
        </div>
    );
}
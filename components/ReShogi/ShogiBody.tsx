import Header from "@/components/Global/Header/Header";
import ShogiContent from "./ShogiContent";
import { HeaderActionStacker } from "@/components/Global/Header/HeaderActionStacker";
import { MintConfig } from "../PMWatch/modules/MintConfig";

import "./shogiUI.styl"
import { useHistoryContext, useLocationContext } from "../Router/RouterContext";
import { HistoryAnchor } from "../Router/HistoryAnchor";
import.meta.glob("./styleModules/**/*.styl", {eager: true})

export default function ShogiBody() {
    const history = useHistoryContext()
    const location = useLocationContext()
    const [contextData, setContextData] = useState<any>(null);
    useEffect(() => {
        async function fetchData() {
            const contextData = JSON.parse(
                document
                    .getElementsByName("server-context")[0]
                    .getAttribute("content")!,
            )
            console.log("initial contextdata",contextData)
            setContextData(contextData)
        }
        fetchData()
    }, [])



    return (
        <div className="container reshogi-container">
            <div className="shogi-yorokobi-message">
                Welcome to the Project Re:Shogi ranking page!!!!!!
            </div>
            <div className="shogi-type-selector">
                <HistoryAnchor className="shogi-type-selector-button" aria-disabled="true">For who?</HistoryAnchor>
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.replace(/\?.*/, "") === "/ranking"} href="/ranking">メイン</HistoryAnchor>
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.startsWith("/ranking/genre")} href="/ranking/genre">総合ランキング</HistoryAnchor>
            </div>
            <ShogiContent/>
        </div>
    );
}
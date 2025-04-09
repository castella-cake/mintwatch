import Header from "@/components/Global/Header/Header";
import ShogiContent from "./ShogiContent";
import { HeaderActionStacker } from "@/components/Global/Header/HeaderActionStacker";
import { MintConfig } from "../PMWatch/modules/MintConfig";

export default function ShogiBody() {
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

    const mintConfigElemRef = useRef<HTMLDivElement>(null);
    const headerActionStackerElemRef = useRef<HTMLDivElement>(null);
    return (
        <div className="container">
            <Header contextData={contextData}/>
            <HeaderActionStacker nodeRef={headerActionStackerElemRef} />
            <MintConfig nodeRef={mintConfigElemRef} />
            <div className="shogi-yorokobi-message">
                Welcome to the Project Re:Shogi ranking page!!!!!!
            </div>
            <div className="shogi-type-selector">
                <button className="shogi-type-selector-button" aria-disabled="true">For who?</button>
                <button className="shogi-type-selector-button" data-is-active="true">メイン</button>
                <button className="shogi-type-selector-button" aria-disabled="true">総合ランキング</button>
            </div>
            <ShogiContent/>
        </div>
    );
}
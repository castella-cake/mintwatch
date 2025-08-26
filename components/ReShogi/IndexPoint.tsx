import { useHistoryContext } from "../Router/RouterContext"

export function IndexRankingContent() {
    const history = useHistoryContext()
    useEffect(() => {
        history.replace("/ranking/custom")
    }, [])
    return (
        <div className="reshogi-index-container">

        </div>
    )
}

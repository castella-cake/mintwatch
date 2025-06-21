import { useHistoryContext } from "../Router/RouterContext"

export default function ForYouRankingContent() {
    const history = useHistoryContext()
    useEffect(() => {
        history.replace("/ranking/custom")
    }, [])
    return <div className="reshogi-for-you-container">

    </div>
}
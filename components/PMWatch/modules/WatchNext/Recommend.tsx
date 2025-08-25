// import { useLang } from "../localizeHook";
import { useRecommendContext } from "@/components/Global/Contexts/RecommendProvider"
import { InfoCardFromRecommend } from "@/components/Global/InfoCard"
function Recommend() {
    const { showExtendedRecommend, showLiveInRecommend } = useStorageVar(["showExtendedRecommend", "showLiveInRecommend"])
    const recommendData = useRecommendContext()

    if (!recommendData || !recommendData.data)
        return (
            <span>レコメンド取得中</span>
        )
    return (
        recommendData.data.items.map((elem) => {
            return (
                <InfoCardFromRecommend
                    key={`recommend-${elem.id}`}
                    obj={elem}
                    isExtendedView={showExtendedRecommend}
                    omitTypes={showLiveInRecommend ? [] : ["live"]}
                />
            )
        })
    )
}

export default Recommend

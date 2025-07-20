
//import { useLang } from "../localizeHook";
import { useRecommendContext } from "@/components/Global/Contexts/RecommendProvider";
import { InfoCardFromRecommend } from "@/components/Global/InfoCard";
function Recommend() {
    const recommendData = useRecommendContext();

    if (!recommendData || !recommendData.data)
        return (
            <span>レコメンド取得中</span>
        );
    return (
        recommendData.data.items.map((elem) => {
            return (
                <InfoCardFromRecommend
                    key={`recommend-${elem.id}`}
                    obj={elem}
                />
            );
        })
    );
}

export default Recommend;

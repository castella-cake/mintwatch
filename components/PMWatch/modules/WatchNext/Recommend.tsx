
//import { useLang } from "../localizeHook";
import { InfoCard } from "../Info/InfoCards";
import { useRecommendContext } from "@/components/Global/Contexts/RecommendProvider";
function Recommend() {
    const recommendData = useRecommendContext();

    if (!recommendData || !recommendData.data)
        return (
            <span>レコメンド取得中</span>
        );
    return (
        recommendData.data.items.map((elem, index) => {
            return (
                <InfoCard
                    key={`recommend-${elem.id}`}
                    obj={elem}
                />
            );
        })
    );
}

export default Recommend;

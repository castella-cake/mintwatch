import { useEffect } from "react";
//import { useLang } from "../localizeHook";
import { InfoCard } from "../Info/InfoCards";
import { useRecommendContext } from "../Contexts/RecommendProvider";
function Recommend() {
    const recommendData = useRecommendContext();

    useEffect(() => {
        // 今は要素が利用可能であるということだけを伝えます
        if (recommendData.data)
            document.dispatchEvent(
                new CustomEvent("pmw_recommendReady", { detail: "" }),
            ); // JSON.stringify({ recommendData: recommendResponse })
    }, [recommendData]);

    if (!recommendData.data)
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

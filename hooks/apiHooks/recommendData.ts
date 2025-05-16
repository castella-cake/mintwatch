import { RecommendDataRootObject } from "@/types/RecommendData";

export function useRecommendData(smId: string | null) {
    const [recommendData, setRecommendData] = useState<RecommendDataRootObject | null>(null);
    useEffect(() => {
        async function fetchInfo() {
            if (!smId) {
                setRecommendData(null)
                return;
            }
            const recommendResponse = await getRecommend(smId);
            setRecommendData(recommendResponse);
            //console.log(commentResponse)
        }
        fetchInfo();
    }, [smId]);
    return recommendData;
}

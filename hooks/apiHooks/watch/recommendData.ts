import { useQuery } from "@tanstack/react-query"

export function useRecommendData(smId: string | null) {
    const { data: recommendData } = useQuery({
        queryKey: ["recommendData", smId],
        queryFn: () => {
            if (!smId) throw new Error("no-smid") // 無効時には fetch させないように工夫
            return getRecommend(smId)
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return recommendData
}

import { useQuery } from "@tanstack/react-query"

export function useCommonsRelativeData(smId: string | undefined, externalDisableCondition?: boolean) {
    const { data: commonsRelativeData } = useQuery({
        queryKey: ["commonsRelativeData", smId],
        queryFn: () => {
            if (!smId) throw new Error("no-smid") // 無効時には fetch させないように工夫
            return getCommonsRelatives(smId)
        },
        enabled: !!smId && !externalDisableCondition, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return commonsRelativeData
}

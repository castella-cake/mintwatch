import { useQuery } from "@tanstack/react-query";

export function usePickupSupportersData(smId: string | null, limit = 10) {
    const { data: pickupSupportersData } = useQuery({
        queryKey: ['pickupSupportersData', smId],
        queryFn: () => {
            if (!smId) throw new Error('no-smid') // 無効時には fetch させないように工夫
            return getPickupSupporters(smId, limit)
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return pickupSupportersData
}

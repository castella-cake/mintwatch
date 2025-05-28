import { useQuery } from "@tanstack/react-query";


export function useLikeMessageDataQuery(smId: string | null) {
    const { data: likeMessageData, isLoading } = useQuery({
        queryKey: ['likeResponse', smId],
        queryFn: () => {
            if (!smId) throw new Error('no-smid') // 無効時には fetch させないように工夫
            return sendLike(
                smId,
                "GET",
            );
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
    })
    return { likeMessageData, isLoading }
}
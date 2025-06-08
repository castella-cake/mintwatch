import { getLyrics } from "@/utils/apis/lyric";
import { useQuery } from "@tanstack/react-query";

export function useLyricData(smId: string | null) {
    const { data: lyricData, error, isLoading } = useQuery({
        queryKey: ['lyricData', smId],
        queryFn: () => {
            if (!smId) throw new Error('no-smid') // 無効時には fetch させないように工夫
            return getLyrics(smId)
        },
        enabled: !!smId, // smId が falsy（null, undefined, ''）ならフェッチしない
        retry: false,
    })
    return { lyricData, error, isLoading }
}

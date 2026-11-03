import { useQuery } from "@tanstack/react-query"

export function useV2SearchData(type: "keyword" | "tag" | "lockTag", query: string, pageSize: number, sortKey?: string, sortOrder?: string, genres?: string) {
    const { data: v2SearchData } = useQuery({
        queryKey: ["v2Search", type, query, pageSize, sortKey, sortOrder, genres],
        queryFn: () => {
            if (!query) throw new Error("no-query") // 無効時には fetch させないように工夫
            return getV2Search(type, query, pageSize, sortKey, sortOrder, genres)
        },
        enabled: !!query, // query が falsy（null, undefined, ''）ならフェッチしない
    })
    return v2SearchData
}

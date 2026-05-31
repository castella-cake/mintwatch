import { useQuery } from "@tanstack/react-query"
import { getGenres } from "@/utils/apis/genres"

export function useGenresQuery() {
    const { data: genresData, isLoading, error } = useQuery({
        queryKey: ["genres"],
        queryFn: () => {
            return getGenres()
        },
    })

    return { genresData, isLoading, error }
}

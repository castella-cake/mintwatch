import { useQuery } from "@tanstack/react-query"

export function useNicoruReceiveCountData() {
    const { data: nicoruReceiveCountData, error, isLoading } = useQuery({
        queryKey: ["nicoruReceiveCountData"],
        queryFn: () => {
            return getNicoruReceiveCount()
        },
    })
    return { nicoruReceiveCountData, error, isLoading }
}

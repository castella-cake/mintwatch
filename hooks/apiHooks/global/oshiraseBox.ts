import { useQuery } from "@tanstack/react-query";

export function useOshiraseBoxData() {
    const { data: oshiraseBoxData } = useQuery({
        queryKey: ['oshiraseBox'],
        queryFn: () => {
            return getOshiraseBox()
        },
    })
    return oshiraseBoxData
}
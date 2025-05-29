import { OshiraseBellDataRootObject } from "@/types/OshiraseBellData";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useOshiraseBellQuery() {
    const queryClient = useQueryClient()
    const { data: oshiraseBellData } = useQuery({
        queryKey: ['oshiraseBell'],
        queryFn: () => {
            return getOshiraseBell()
        },
    })

    function setOshiraseBellData(data: OshiraseBellDataRootObject) {
        queryClient.setQueryData(['oshiraseBell'], data);
    }
    return { oshiraseBellData, setOshiraseBellData }
}
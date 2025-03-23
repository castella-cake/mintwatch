import { OshiraseBellDataRootObject } from "@/types/OshiraseBellData";

export default function useOshiraseBell() {
    const [isBellActive, setIsBellActive] = useState(false);
    useEffect(() => {
        async function fetchBell() {
            const bellData: OshiraseBellDataRootObject = await getOshiraseBell();
            if ( bellData.meta.status !== 200 ) {
                setIsBellActive(false);
                return;
            }
            setIsBellActive(bellData.data.badge);
        }
        fetchBell();
    }, [])
    return {isBellActive,setIsBellActive};
}
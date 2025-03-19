import { useEffect } from "react";
//import { useLang } from "../localizeHook";
import { InfoCard } from "../Info/InfoCards";
import { UserVideoData } from "@/types/UserVideoData";
import { VideoOwner } from "@/types/VideoData";

function UserVideos({ videoOwnerData }: { videoOwnerData?: VideoOwner }) {
    //const lang = useLang()
    const [userVideos, setUserVideos] = useState<UserVideoData | null>(null);

    useEffect(() => {
        async function getUserVideoData() {
            if (!videoOwnerData) return;
            const response: UserVideoData = await getUserVideo(
                videoOwnerData.id,
                "registeredAt",
                "desc",
            );
            if (response.meta.status === 200) setUserVideos(response);
        }
        getUserVideoData();
    }, [videoOwnerData]);

    return (
        userVideos && userVideos.data.items.map((item) => {
            return (
                <InfoCard
                    key={`userVideos-${item.essential.id}`}
                    obj={{
                        id: item.essential.id,
                        contentType: "video",
                        recommendType: "",
                        content: { ...item.essential },
                    }}
                />
            );
        })
    );
}

export default UserVideos;

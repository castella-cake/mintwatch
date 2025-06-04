//import { useLang } from "../localizeHook";
import { InfoCard } from "../Info/InfoCards";
import { VideoOwner } from "@/types/VideoData";
import { useUserVideoData } from "@/hooks/apiHooks/watch/userVideoData";

function UserVideos({ videoOwnerData }: { videoOwnerData?: VideoOwner }) {
    //const lang = useLang()
    const userVideoData = useUserVideoData(videoOwnerData && videoOwnerData.id)

    return (
        userVideoData && userVideoData.data.items.map((item) => {
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

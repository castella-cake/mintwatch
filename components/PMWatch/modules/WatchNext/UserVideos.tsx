//import { useLang } from "../localizeHook";
import { InfoCardFromRecommend } from "@/components/Global/InfoCard";
import { VideoOwner } from "@/types/VideoData";
import { useUserVideoData } from "@/hooks/apiHooks/watch/userVideoData";

function UserVideos({ videoOwnerData }: { videoOwnerData?: VideoOwner | null }) {
    //const lang = useLang()
    const userVideoData = useUserVideoData(videoOwnerData ? videoOwnerData.id : undefined)

    return (
        userVideoData && userVideoData.data.items.map((item) => {
            return (
                <InfoCardFromRecommend
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
